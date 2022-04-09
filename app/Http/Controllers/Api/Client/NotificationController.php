<?php

namespace Pterodactyl\Http\Controllers\Api\Client;

use Illuminate\Http\Request;
use Pterodactyl\Models\Notification;
use Pterodactyl\Transformers\Api\Client\NotificationTransformer;

class NotificationController extends ClientApiController
{
    /**
     * NotificationController constructor.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Get all notifications a user owns and return them.
     */
    public function index(Request $request): array
    {
        return $this->fractal->collection($request->user()->notifications)
            ->transformWith($this->getTransformer(NotificationTransformer::class))
            ->toArray();
    }

    /**
     * Delete all notifications a user owns.
     */
    public function delete(Request $request)
    {
        Notification::where('user_id', $request->user()->id)->delete();
    }
}
