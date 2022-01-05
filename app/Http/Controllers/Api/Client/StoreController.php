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
    public ServerCreationService $creationService;

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
        $allocation = $this->getAllocationId();
        if (!$allocation) throw new DisplayException('No allocations could be found on the requested node.');

        $this->validate($request, [
            'name' => 'required',
            'cpu' => 'required',
            'ram' => 'required',
            'storage' => 'required',
            'egg' => 'required|integer'
        ]);

        $data = [
            'name' => $request->input('name'),
            'owner_id' => $request->user()->id,
            'egg' => $request->input('egg'),
            'allocation_id' => $allocation,
            'environment' => [],
            'memory' => $request->input('ram'),
            'disk' => $request->input('storage'),
            'cpu' => $request->input('cpu'),
            'swap' => 0,
            'io' => 500,
            'image' => 'ghcr.io/pterodactyl/yolks:nodejs_14',
            'startup' => 'node index.js',
            'start_on_completion' => true,
        ];

        $egg = DB::table('eggs')->where('id', '=', $request->input('egg'))->first();
        $nest = DB::table('nests')->where('id', '=', $egg->nest_id)->first();
        foreach (DB::table('egg_variables')->where('egg_id', '=', $egg->id)->get() as $var) {
            $key = "v{$nest->id}-{$egg->id}-{$var->env_variable}";
            $data['environment'][$var->env_variable] = $request->get($key, $var->default_value);
        }


        if($request->user()->cr_cpu < $request->input('cpu')) {
            throw new DisplayException('Nicetry - looks like you don\'t have that much CPU available.');
        }
        if($request->user()->cr_ram < $request->input('ram')) {
            throw new DisplayException('Nicetry - looks like you don\'t have that much RAM available.');
        }
        if($request->user()->cr_storage < $request->input('storage')) {
            throw new DisplayException('Nice try - looks like you don\'t have that much storage available.');
        }

        $server = $this->creationService->handle($data);
        $server->save();


        DB::table('users')->where('id', '=', $request->user()->id)->update([
            'cr_cpu' => $request->user()->cr_cpu - $request->input('cpu'),
            'cr_ram' => $request->user()->cr_ram - $request->input('ram'),
            'cr_storage' => $request->user()->cr_storage - $request->input('storage'),
        ]);


        return [
            'success' => true,
            'data' => [],
        ];
    }

    private function getAllocationId($memory = 0, $attempt = 0): ?bool
    {

        if ($attempt > 5) return null;

        $node = Node::where('nodes.public', true)->where('nodes.maintenance_mode', false)->first();

        if (!$node) return false;

        $allocation = $node->allocations()->where('server_id', null)->inRandomOrder()->first();

        if (!$allocation) return $this->getAllocationId($memory, $attempt+1);

        return $allocation->id;
    }
}
