<?php

namespace Pterodactyl\Http\Controllers\Api\Client;


use Pterodactyl\Http\Requests\Api\Client\StoreRequest;
use Pterodactyl\Models\Node;
use Illuminate\Support\Facades\DB;
use Pterodactyl\Services\Servers\ServerCreationService;
use Pterodactyl\Exceptions\DisplayException;

class StoreController extends ClientApiController
{

    public function __construct(ServerCreationService $creationService)
    {
        $this->creationService = $creationService;
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

    public function newServer(StoreRequest $request): array
    {   
        $allocation = $this->getAllocationId();

        $this->validate($request, [
            'name' => 'required',
            'cpu' => 'required|numeric|min:50',
            'ram' => 'required|numeric|min:1024',
            'storage' => 'required|numeric|min:1024',
        ]);

        if($request->user()->cr_cpu < $request->input('cpu')) {
            throw new DisplayException('Nicetry - looks like you don\'t have that much CPU available.');
        }
        if($request->user()->cr_ram < $request->input('ram')) {
            throw new DisplayException('Nicetry - looks like you don\'t have that much RAM available.');
        }
        if($request->user()->cr_storage < $request->input('storage')) {
            throw new DisplayException('Nice try - looks like you don\'t have that much storage available.');
        }
        if (!$allocation) throw new DisplayException('No allocations could be found on the requested node.');
    
        $data = [
            'name' => $request->input('name'),
            'owner_id' => $request->user()->id,
            'egg_id' => 3,
            'nest_id' => 1,
            'allocation_id' => $allocation,
            'environment' => [],
            'memory' => $request->input('ram'),
            'disk' => $request->input('storage'),
            'cpu' => $request->input('cpu'),
            'swap' => 0,
            'io' => 500,
            'image' => 'ghcr.io/pterodactyl/yolks:java_17',
            'startup' => 'java -Xms128M -Xmx{{SERVER_MEMORY}}M -Dterminal.jline=false -Dterminal.ansi=true -jar {{SERVER_JARFILE}}',
            'start_on_completion' => true,
        ];

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

    private function getAllocationId($memory = 0, $attempt = 0)
    {
        
        if ($attempt > 5) return null;
        
        $node = Node::where('nodes.public', true)->where('nodes.maintenance_mode', false)->first();

        if (!$node) return false;

        $allocation = $node->allocations()->where('server_id', null)->inRandomOrder()->first();

        if (!$allocation) return $this->getAllocationId($memory, $attempt+1);

        return $allocation->id;
    }
}