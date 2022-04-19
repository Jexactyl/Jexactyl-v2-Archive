<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Credits;

use Throwable;
use Pterodactyl\Models\Server;
use Illuminate\Support\Facades\DB;
use Pterodactyl\Exceptions\DisplayException;
use Illuminate\Validation\ValidationException;
use Pterodactyl\Repositories\Eloquent\NodeRepository;
use Pterodactyl\Http\Requests\Api\Client\StoreRequest;
use Pterodactyl\Services\Servers\ServerCreationService;
use Pterodactyl\Exceptions\Repository\RecordNotFoundException;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;
use Pterodactyl\Exceptions\Service\Deployment\NoViableNodeException;
use Pterodactyl\Exceptions\Service\Deployment\NoViableAllocationException;

class ServerController extends ClientApiController
{
    private ServerCreationService $creationService;
    private NodeRepository $nodeRepository;

    /**
     * ServerController constructor.
     */
    public function __construct(
        ServerCreationService $creationService,
        NodeRepository $nodeRepository
    )
    {
        parent::__construct();
        $this->creationService = $creationService;
        $this->nodeRepository = $nodeRepository;
    }

    /**
     * Get the configuration for users visiting the store.
     */
    public function getConfig(StoreRequest $request): array
    {
        $user = DB::table('users')->select('cr_slots', 'cr_cpu', 'cr_ram', 'cr_storage')->where('id', '=', $request->user()->id)->get();

        return [
            'success' => true,
            'data' => [
                'user' => $user,
            ],
        ];
    }

    /**
     * Deploys a server to Jexactyl via the store.
     * 
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

        $egg = DB::table('eggs')->where('id', '=', 1)->first();
        $nest = DB::table('nests')->where('id', '=', 1)->first();

        $data = [
            'name' => $request->input('name'),
            'owner_id' => $request->user()->id,
            'egg_id' => $egg->id,
            'nest_id' => $nest->id,
            'allocation_id' => $this->getAllocationId(['mem' => $request->input('ram') * 1024, 'disk' => $request->input('storage') * 1024]),
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

        foreach (DB::table('egg_variables')->where('egg_id', '=', $egg->id)->get() as $var) {
            $key = "v{$nest->id}-{$egg->id}-{$var->env_variable}";
            $data['environment'][$var->env_variable] = $request->get($key, $var->default_value);
        }

        if (
            $request->user()->cr_slots < 1 |
            $request->user()->cr_cpu < $request->input('cpu') |
            $request->user()->cr_ram < $request->input('ram') |
            $request->user()->cr_storage < $request->input('storage')
        ) {
            throw new DisplayException('You don\'t have the resources available to make this server.');
        }

        $server = $this->creationService->handle($data);
        $server->save();

        DB::table('users')->where('id', '=', $request->user()->id)->update([
            'cr_slots' => $request->user()->cr_slots - 1,
            'cr_cpu' => $request->user()->cr_cpu - $request->input('cpu'),
            'cr_ram' => $request->user()->cr_ram - $request->input('ram') * 1024,
            'cr_storage' => $request->user()->cr_storage - $request->input('storage') * 1024,
        ]);

        return [
            'success' => true,
            'data' => [],
        ];
    }

    /**
     * Deletes a server from the system and adds
     * resources back to the user when deleted.
     * 
     * @throws DisplayException
     */
    public function deleteServer(StoreRequest $request, Server $server): array
    {
        $user = $request->user();
        $user->update([
            'cr_slots' => $user->cr_clots + 1,
            'cr_cpu' => $user->cr_cpu + $server->cpu,
            'cr_ram' => $user->cr_ram + $server->memory,
            'cr_storage' => $user->cr_storage + $server->disk,
        ]);

        try {
            $server->delete();
        } catch (DisplayException $ex) {
            throw new DisplayException('Unable to delete the server from the system.');
        }

        return [
            'success' => true,
            'data' => []
        ];
    }

    /**
     * Gets an allocation for server deployment.
     * 
     * @throws DisplayException
     */
    private function getAllocationId(array $data): int
    {
        $nodes = $this->nodeRepository->getNodesForServerCreation();
        $available_nodes = [];
        foreach ($nodes as $node) {
            $x = $this->nodeRepository->getNodeWithResourceUsage($node['id']);
            if ($x->getOriginal('sum_memory') <= $x->getOriginal('memory') - $data['mem']) {
                $available_nodes[] = $x->id;
            }
        }
        if ($available_nodes > 0) {
            $node = $available_nodes[0];
        } else throw new DisplayException('There are no available nodes.');
        $allocation = DB::table('allocations')->select('*')->where('node_id', '=', $node)->where('server_id', '=', null)->get()->first();
        if (!$allocation) {
            throw new DisplayException('No allocations are available to deploy an instance.');
        };
        return $allocation->id;
    }
}
