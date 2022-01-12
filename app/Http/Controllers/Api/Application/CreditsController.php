<?php

namespace Pterodactyl\Http\Controllers\Api\Application;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;
use Pterodactyl\Http\Requests\Api\Application\Credits\GetCreditsRequest;

class CreditsController extends ClientApiController
{
    /**
     * Returns a users credit balance.
     * @param GetCreditsRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function get(GetCreditsRequest $request, int $id): JsonResponse
    {
        $dataRaw = DB::table('users')->select('cr_balance', 'cr_cpu', 'cr_ram', 'cr_storage')->where('id', '=', $id)->get();
        $dataArr = array('cr_balance' => $dataRaw[0]->cr_balance, 'cr_cpu' => $dataRaw[0]->cr_cpu, 'cr_ram' => $dataRaw[0]->cr_ram, 'cr_storage' => $dataRaw[0]->cr_storage);
        $data = json_encode($dataArr);
        return new JsonResponse($data, 200, [], null, true);
    }
}
