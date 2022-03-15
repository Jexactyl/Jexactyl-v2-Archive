<?php

namespace Pterodactyl\Http\Controllers\Api\Application;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Pterodactyl\Contracts\Repository\CreditsRepositoryInterface;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;
use Pterodactyl\Http\Requests\Api\Application\CreditsRequest;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class CreditsController extends ClientApiController
{
    public CreditsRepositoryInterface $credits;

    public function __construct(CreditsRepositoryInterface $credits)
    {
        parent::__construct();
        $this->credits = $credits;
    }

    /**
     * Returns a users credit balances.
     * @param int $id
     * @return JsonResponse
     * @throws NotFoundHttpException
     */
    public function get(int $id): JsonResponse
    {
        if ($this->credits->get('credits:enabled') === '0') throw new NotFoundHttpException();
        $data_raw = DB::table('users')->select('cr_balance', 'cr_cpu', 'cr_ram', 'cr_storage', 'cr_slots')->where('id', '=', $id)->get();
        $data_array = array('balance' => $data_raw[0]->cr_balance, 'cpu' => $data_raw[0]->cr_cpu, 'ram' => $data_raw[0]->cr_ram, 'storage' => $data_raw[0]->cr_storage, 'slots' => $data_raw[0]->cr_slots);
        $data = json_encode($data_array);
        return new JsonResponse($data, 200, [], null, true);
    }

    /**
     * Sets a users credit balances.
     * @param CreditsRequest $request
     * @param int $id
     * @return JsonResponse
     * @throws NotFoundHttpException
     */
    public function set(CreditsRequest $request, int $id): JsonResponse
    {
        if ($this->credits->get('credits:enabled') === '0') throw new NotFoundHttpException();
        $data = array('cr_balance' => $this->isValid($request->input('balance', null), $id, 'cr_balance'), 'cr_cpu' => $this->isValid($request->input('cpu', null), $id, 'cr_cpu'), 'cr_ram' => $this->isValid($request->input('ram'), $id, 'cr_ram'), 'cr_storage' => $this->isValid($request->input('storage'), $id, 'cr_storage'), 'cr_slots' => $this->isValid($request->input('slots'), $id, 'cr_slots'));
        DB::table('users')->where('id', '=', $id)->update($data);
        return new JsonResponse(json_encode(['success' => true]), 200, [], null, true);
    }

    /**
     * Adds to a users credit balances.
     * @param CreditsRequest $request
     * @param int $id
     * @return JsonResponse
     * @throws NotFoundHttpException
     */
    public function add(CreditsRequest $request, int $id): JsonResponse
    {
        if ($this->credits->get('credits:enabled') === '0') throw new NotFoundHttpException();
        $user_data = DB::table('users')->where('id', '=', $id)->select(['cr_balance', 'cr_cpu', 'cr_ram', 'cr_storage', 'cr_slots'])->get()[0];
        $data = array('cr_balance' => $user_data->cr_balance + $request->input('balance', 0), 'cr_cpu' => $user_data->cr_cpu + $request->input('cpu', 0), 'cr_ram' => $user_data->cr_ram + $request->input('ram', 0), 'cr_storage' => $user_data->cr_storage + $request->input('storage', 0), 'cr_slots' => $user_data->cr_slots + $request->input('slots', 0));
        DB::table('users')->where('id', '=', $id)->update($data);
        return new JsonResponse(json_encode(['success' => true]), 200, [], null, true);
    }

    /**
     * Subtracts from a users credit balances.
     * @param CreditsRequest $request
     * @param int $id
     * @return JsonResponse
     * @throws NotFoundHttpException
     */
    public function remove(CreditsRequest $request, int $id): JsonResponse
    {
        if ($this->credits->get('credits:enabled') === '0') throw new NotFoundHttpException();
        $user_data = DB::table('users')->where('id', '=', $id)->select(['cr_balance', 'cr_cpu', 'cr_ram', 'cr_storage', 'cr_slots'])->get()[0];
        $data = array('cr_balance' => $user_data->cr_balance - $request->input('balance', 0), 'cr_cpu' => $user_data->cr_cpu - $request->input('cpu', 0), 'cr_ram' => $user_data->cr_ram - $request->input('ram', 0), 'cr_storage' => $user_data->cr_storage - $request->input('storage', 0), 'cr_slots' => $user_data->cr_slots - $request->input('slots', 0));
        DB::table('users')->where('id', '=', $id)->update($data);
        return new JsonResponse(json_encode(['success' => true]), 200, [], null, true);
    }

    /**
     * @param $data
     * @param int $id
     * @param string $name
     * @return string
     */
    public function isValid($data, int $id, string $name): string
    {
        $user_data = DB::table('users')->where('id', '=', $id)->select(['cr_balance', 'cr_cpu', 'cr_ram', 'cr_storage', 'cr_slots'])->get()[0];
        return $data ?? $user_data->$name;
    }
}
