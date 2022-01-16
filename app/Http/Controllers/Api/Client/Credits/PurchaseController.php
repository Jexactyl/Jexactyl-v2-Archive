<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Credits;

use Illuminate\Support\Facades\DB;
use Pterodactyl\Http\Requests\Api\Client\StoreRequest;
use Pterodactyl\Contracts\Repository\CreditsRepositoryInterface;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;

class PurchaseController extends ClientApiController
{
    public CreditsRepositoryInterface $credits;

    public function __construct(CreditsRepositoryInterface $credits)
    {
        parent::__construct();
        $this->credits = $credits;
        $this->balance = DB::table('users')->select('cr_balance')->where('id', '=', $request->user()->id)->get();
    }

    public function buySlots(StoreRequest $request): array
    {
        $user_slots = DB::table('users')->select('cr_slots')->where('id', '=', $request->user()->id)->get();
        $slots_cost = $this->credits->get('store:slots_cost', 100);

        if ($this->balance < $slots_cost) {
            throw new DisplayException('You don\'t have enough credits to purchase this resource.');
            return [
                'success' => false,
                'data' => []
            ];
        }

        DB::table('users')->where('id', '=', $request->user()->id)->update([
            'cr_balance' => $this->balance - $slots_cost,
            'cr_slots' => $user_slots + 1
        ]);

        return [
            'success' => true,
            'data' => []
        ];
    }

    public function buyCPU(StoreRequest $request): array
    {
        $user_cpu = DB::table('users')->select('cr_cpu')->where('id', '=', $request->user()->id)->get();
        $cpu_cost = $this->credits->get('store:cpu_cost', 20);

        if ($this->balance < $cpu_cost) {
            throw new DisplayException('You don\'t have enough credits to purchase this resource.');
            return [
                'success' => false,
                'data' => []
            ];
        }

        DB::table('users')->where('id', '=', $request->user()->id)->update([
            'cr_balance' => $this->balance - $cpu_cost,
            'cr_cpu' => $user_cpu + 50
        ]);

        return [
            'success' => true,
            'data' => []
        ];
    }

    public function buyRAM(StoreRequest $request): array
    {
        $user_ram = DB::table('users')->select('cr_ram')->where('id', '=', $request->user()->id)->get();
        $ram_cost = $this->credits->get('store:ram_cost', 10);

        if ($this->balance < $ram_cost) {
            throw new DisplayException('You don\'t have enough credits to purchase this resource.');
            return [
                'success' => false,
                'data' => []
            ];
        }

        DB::table('users')->where('id', '=', $request->user()->id)->update([
            'cr_balance' => $this->balance - $ram_cost,
            'cr_ram' => $user_ram + 1024
        ]);

        return [
            'success' => true,
            'data' => []
        ];
    }

    public function buyStorage(StoreRequest $request): array
    {
        $user_storage = DB::table('users')->select('cr_storage')->where('id', '=', $request->user()->id)->get();
        $storage_cost = $this->credits->get('store:storage_cost', 5);

        if ($this->balance < $storage_cost) {
            throw new DisplayException('You don\'t have enough credits to purchase this resource.');
            return [
                'success' => false,
                'data' => []
            ];
        }

        DB::table('users')->where('id', '=', $request->user()->id)->update([
            'cr_balance' => $this->balance - $storage_cost,
            'cr_storage' => $user_storage + 1024
        ]);

        return [
            'success' => true,
            'data' => []
        ];
    }
}
