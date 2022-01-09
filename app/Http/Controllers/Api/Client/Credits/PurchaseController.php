<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Credits;

use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Pterodactyl\Exceptions\DisplayException;
use Pterodactyl\Contracts\Repository\CreditsRepositoryInterface;
use Pterodactyl\Exceptions\Repository\RecordNotFoundException;
use Pterodactyl\Exceptions\Service\Deployment\NoViableAllocationException;
use Pterodactyl\Exceptions\Service\Deployment\NoViableNodeException;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;
use Pterodactyl\Http\Requests\Api\Client\StoreRequest;
use Pterodactyl\Models\Node;
use Pterodactyl\Services\Servers\ServerCreationService;
use Throwable;

class PurchaseController extends ClientApiController
{
    public CreditsRepositoryInterface $credits;

    /**
     * @throws DisplayException
     */
    public function buyCPU(StoreRequest $request): array
    {
        $userBal = DB::table('users')->select('cr_balance')->where('id', '=', $request->user()->id)->get();
        $userCPU = DB::table('users')->select('cr_cpu')->where('id', '=', $request->user()->id)->get();
        $cost = $this->credits->get('store:cpu_cost', 20);

        if ($userBal < $cost) {
            return throw new DisplayException('You do not have the required amount of credits.');
        }
        
        DB::table('users')->where('id', '=', $request->user()->id)->update(['cr_cpu' => $userCPU + 50]);
        DB::table('users')->where('id', '=', $request->user()->id)->update(['cr_balance' => $userBal - $cost]);

        return [
            'success' => true,
            'data' => []
        ];
    }
}
