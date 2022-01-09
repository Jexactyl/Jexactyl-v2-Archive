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
    }

    public function buyCPU(StoreRequest $request): array
    {
        $userBalRaw = DB::table('users')->select('cr_balance')->where('id', '=', $request->user()->id)->get();
        $userCPURaw = DB::table('users')->select('cr_cpu')->where('id', '=', $request->user()->id)->get();
        $userBal = $userBalRaw[0]->cr_balance;
        $userCPU = $userCPURaw[0]->cr_cpu;
        $cost = $this->credits->get('store:cpu_cost', 20);

        if ($userBal < $cost) {
            return [
                'success' => false,
                'data' => []
            ];
        }

        DB::table('users')->where('id', '=', $request->user()->id)->update(['cr_cpu' => $userCPU + 50]);
        DB::table('users')->where('id', '=', $request->user()->id)->update(['cr_balance' => $userBal - $cost]);

        return [
            'success' => true,
            'data' => []
        ];
    }
}
