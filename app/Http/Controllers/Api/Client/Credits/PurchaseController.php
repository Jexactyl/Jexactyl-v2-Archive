<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Credits;

use Illuminate\Support\Facades\DB;
use PayPalHttp\HttpException;
use PayPalHttp\IOException;
use Pterodactyl\Exceptions\DisplayException;
use Pterodactyl\Http\Requests\Api\Client\StoreRequest;
use Pterodactyl\Contracts\Repository\CreditsRepositoryInterface;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;
use PayPalCheckoutSdk\Core\PayPalHttpClient;
use PayPalCheckoutSdk\Core\SandboxEnvironment;
use PayPalCheckoutSdk\Orders\OrdersCreateRequest;

class PurchaseController extends ClientApiController
{
    public CreditsRepositoryInterface $credits;

    public function __construct(CreditsRepositoryInterface $credits)
    {
        parent::__construct();
        $this->credits = $credits;
    }

    /**
     * @throws DisplayException
     */
    public function buySlots(StoreRequest $request): array
    {
        $userBalRaw = DB::table('users')->select('cr_balance')->where('id', '=', $request->user()->id)->get();
        $userSlotsRaw = DB::table('users')->select('cr_slots')->where('id', '=', $request->user()->id)->get();
        $userBal = $userBalRaw[0]->cr_balance;
        $userSlots = $userSlotsRaw[0]->cr_slots;
        $cost = $this->credits->get('store:slots_cost', 100);

        if ($userBal < $cost) {
            throw new DisplayException('You don\'t have enough credits to purchase this resource.');
        }

        DB::table('users')->where('id', '=', $request->user()->id)->update(['cr_slots' => $userSlots + 1]);
        DB::table('users')->where('id', '=', $request->user()->id)->update(['cr_balance' => $userBal - $cost]);

        return [
            'success' => true,
            'data' => []
        ];
    }

    /**
     * @throws DisplayException
     */
    public function buyCPU(StoreRequest $request): array
    {
        $userBalRaw = DB::table('users')->select('cr_balance')->where('id', '=', $request->user()->id)->get();
        $userCPURaw = DB::table('users')->select('cr_cpu')->where('id', '=', $request->user()->id)->get();
        $userBal = $userBalRaw[0]->cr_balance;
        $userCPU = $userCPURaw[0]->cr_cpu;
        $cost = $this->credits->get('store:cpu_cost', 20);

        if ($userBal < $cost) {
            throw new DisplayException('You don\'t have enough credits to purchase this resource.');
        }

        DB::table('users')->where('id', '=', $request->user()->id)->update(['cr_cpu' => $userCPU + 50]);
        DB::table('users')->where('id', '=', $request->user()->id)->update(['cr_balance' => $userBal - $cost]);

        return [
            'success' => true,
            'data' => []
        ];
    }

    /**
     * @throws DisplayException
     */
    public function buyRAM(StoreRequest $request): array
    {
        $userBalRaw = DB::table('users')->select('cr_balance')->where('id', '=', $request->user()->id)->get();
        $userRAMRaw = DB::table('users')->select('cr_ram')->where('id', '=', $request->user()->id)->get();
        $userBal = $userBalRaw[0]->cr_balance;
        $userRAM = $userRAMRaw[0]->cr_ram;
        $cost = $this->credits->get('store:ram_cost', 10);

        if ($userBal < $cost) {
            throw new DisplayException('You don\'t have enough credits to purchase this resource.');
        }

        DB::table('users')->where('id', '=', $request->user()->id)->update(['cr_ram' => $userRAM + 1024]);
        DB::table('users')->where('id', '=', $request->user()->id)->update(['cr_balance' => $userBal - $cost]);

        return [
            'success' => true,
            'data' => []
        ];
    }

    /**
     * @throws DisplayException
     */
    public function buyStorage(StoreRequest $request): array
    {
        $userBalRaw = DB::table('users')->select('cr_balance')->where('id', '=', $request->user()->id)->get();
        $userStorageRaw = DB::table('users')->select('cr_storage')->where('id', '=', $request->user()->id)->get();
        $userBal = $userBalRaw[0]->cr_balance;
        $userStorage = $userStorageRaw[0]->cr_storage;
        $cost = $this->credits->get('store:storage_cost', 5);

        if ($userBal < $cost) {
            throw new DisplayException('You don\'t have enough credits to purchase this resource.');
        }

        DB::table('users')->where('id', '=', $request->user()->id)->update(['cr_storage' => $userStorage + 1024]);
        DB::table('users')->where('id', '=', $request->user()->id)->update(['cr_balance' => $userBal - $cost]);

        return [
            'success' => true,
            'data' => []
        ];
    }

    /**
     * Will redirect the client to PayPal to purchase credits.
     * @return array 
     */
    public function buyCredits(): array
    {
        $client_id = env('PAYPAL_CLIENT_ID');
        $client_secret = env('PAYPAL_CLIENT_SECRET');
        $environment = new SandboxEnvironment($client_id, $client_secret);
        $client = new PayPalHttpClient($environment);

        $order_request = new OrdersCreateRequest();
        $order_request->prefer('return=representation');
        $order_request->body = [
            "intent" => "CAPTURE",
            "purchase_units" => [[
                "reference_id" => "test_ref_id1",
                "amount" => [
                    "value" => "100.00",
                    "currency_code" => "USD"
                ]
            ]],
            "application_context" => [
                "cancel_url" => env('APP_URL')."/callback",
                "return_url" => env('APP_URL')."/return"
            ]
        ];

        try {
            $res = $client->execute($order_request);
        } catch (HttpException $ex) {
            dd($ex);
        } catch (IOException $e) {
            dd($e);
        }

        return [
            'success' => true,
            'data' => []
        ];
    }
}
