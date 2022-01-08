<?php

namespace Pterodactyl\Http\Controllers\Api\Client;

use Throwable;
use Pterodactyl\Models\Node;
use Illuminate\Support\Facades\DB;
use Pterodactyl\Exceptions\DisplayException;
use Illuminate\Validation\ValidationException;
use Pterodactyl\Http\Requests\Api\Client\StoreRequest;
use Pterodactyl\Services\Servers\ServerCreationService;
use Pterodactyl\Exceptions\Repository\RecordNotFoundException;
use Pterodactyl\Exceptions\Service\Deployment\NoViableNodeException;
use Pterodactyl\Exceptions\Service\Deployment\NoViableAllocationException;

class StoreController extends ClientApiController
{
    private Node $node;
    private ServerCreationService $creationService;
    /**
     * StoreController constructor.
     */
    public function __construct(ServerCreationService $creationService, Node $node)
    {
        parent::__construct();

        $this->creationService = $creationService;
        $this->node = $node;
    }


    public function getConfig(StoreRequest $request, $id): array
    {
        $id = (int) $id;
        $user = DB::table('users')->select('cr_ram', 'cr_storage')->where('id', '=', $request->user()->id)->get();

        return [
            'success' => true,
            'data' => [
                'user' => $user,
            ],
        ];

    }

    /**
     * @throws DisplayException
     * @throws NoViableNodeException
     * @throws NoViableAllocationException
     * @throws RecordNotFoundException
     * @throws Throwable
     * @throws ValidationException
     */
    public function newServer(StoreRequest $request): array
    {
        $this->validate($request, [
            'name' => 'required',
            'cpu' => 'required',
            'ram' => 'required',
            'storage' => 'required',
        ]);

        $allocation = $this->getAllocationId(1);
        if ($allocation == -1) throw new DisplayException('No allocations could be found on the requested node.');

        $egg = DB::table('eggs')->where('id', '=', 1)->first();
        $nest = DB::table('nests')->where('id', '=', 1)->first();

        $data = [
            'name' => $request->input('name'),
            'owner_id' => $request->user()->id,
            'egg_id' => $egg->id,
            'nest_id' => $nest->id,
            'allocation_id' => $allocation,
            'environment' => [],
            'memory' => $request->input('ram') * 1024,
            'disk' => $request->input('storage') * 1024,
            'cpu' => $request->input('cpu'),
            'swap' => 0,
            'io' => 500,
            'image' => 'quay.io/chirag350/multi-egg',
            'startup' => $egg->startup,
            'start_on_completion' => true,
        ];

        if ($request->user()->cr_cpu < $request->input('cpu')) {
            throw new DisplayException('Nicetry - looks like you don\'t have that much CPU available.');
        }
        if ($request->user()->cr_ram < $request->input('ram')) {
            throw new DisplayException('Nicetry - looks like you don\'t have that much RAM available.');
        }
        if ($request->user()->cr_storage < $request->input('storage')) {
            throw new DisplayException('Nice try - looks like you don\'t have that much storage available.');
        }

        foreach (DB::table('egg_variables')->where('egg_id', '=', $egg->id)->get() as $var) {
            $key = "v{$nest->id}-{$egg->id}-{$var->env_variable}";
            $data['environment'][$var->env_variable] = $request->get($key, $var->default_value);
        }

        $server = $this->creationService->handle($data);
        $server->save();

        DB::table('users')->where('id', '=', $request->user()->id)->update([
            'cr_cpu' => $request->user()->cr_cpu - $request->input('cpu'),
            'cr_ram' => $request->user()->cr_ram - $request->input('ram') * 1024,
            'cr_storage' => $request->user()->cr_storage - $request->input('storage') * 1024,
        ]);

        return [
            'success' => true,
            'data' => [],
        ];
    }

    private function getAllocationId($node_id): int
    {
        $allocation = DB::table('allocations')->select('*')->where('node_id', '=', $node_id)->where('server_id', '=', null)->get()->first();

        if (!$allocation) return -1;

        return $allocation->id;
    }
}
