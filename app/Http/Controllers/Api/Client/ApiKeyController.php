<?php

namespace Pterodactyl\Http\Controllers\Api\Client;

use Pterodactyl\Models\ApiKey;
use Illuminate\Http\JsonResponse;
use Pterodactyl\Models\Notification;
use Pterodactyl\Facades\Activity;
use Pterodactyl\Exceptions\DisplayException;
use Pterodactyl\Http\Requests\Api\Client\ClientApiRequest;
use Pterodactyl\Transformers\Api\Client\ApiKeyTransformer;
use Pterodactyl\Http\Requests\Api\Client\Account\StoreApiKeyRequest;

class ApiKeyController extends ClientApiController
{
    /**
     * Returns all of the API keys that exist for the given client.
     *
     * @return array
     */
    public function index(ClientApiRequest $request)
    {
        return $this->fractal->collection($request->user()->apiKeys)
            ->transformWith($this->getTransformer(ApiKeyTransformer::class))
            ->toArray();
    }

    /**
     * Store a new API key for a user's account.
     *
     * @return array
     *
     * @throws \Pterodactyl\Exceptions\DisplayException
     */
    public function store(StoreApiKeyRequest $request)
    {
        if ($request->user()->apiKeys->count() >= 5) {
            throw new DisplayException('You have reached the account limit for number of API keys.');
        }

        $token = $request->user()->createToken(
            $request->input('description'),
            $request->input('allowed_ips')
        );

        Notification::create([
            'user_id' => $request->user()->id,
            'action' => Notification::ACCOUNT__APIKEY_CREATE,
            'created' => date('d.m.Y H:i:s'),
        ]);

        Activity::event('user:api-key.create')
            ->subject($token->accessToken)
            ->property('identifier', $token->accessToken->identifier)
            ->log();

        return $this->fractal->item($token->accessToken)
            ->transformWith($this->getTransformer(ApiKeyTransformer::class))
            ->addMeta(['secret_token' => $token->plainTextToken])
            ->toArray();
    }

    /**
     * Deletes a given API key.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete(ClientApiRequest $request, string $identifier)
    {
        /** @var \Pterodactyl\Models\ApiKey $key */
        $key = $request->user()->apiKeys()
            ->where('key_type', ApiKey::TYPE_ACCOUNT)
            ->where('identifier', $identifier)
            ->firstOrFail();

        Activity::event('user:api-key.delete')
            ->property('identifer', $key->identifier)
            ->log();

        Notification::create([
            'user_id' => $request->user()->id,
            'action' => Notification::ACCOUNT__APIKEY_DELETE,
            'created' => date('d.m.Y H:i:s'),
        ]);

        $key->delete();

        return new JsonResponse([], JsonResponse::HTTP_NO_CONTENT);
    }
}
