<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Credits;

use Illuminate\Http\JsonResponse;
use PayPalHttp\IOException;
use Illuminate\Http\Request;
use PayPalHttp\HttpException;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\RedirectResponse;
use PayPalCheckoutSdk\Core\PayPalHttpClient;
use PayPalCheckoutSdk\Core\SandboxEnvironment;
use PayPalCheckoutSdk\Core\ProductionEnvironment;
use PayPalCheckoutSdk\Orders\OrdersCreateRequest;
use PayPalCheckoutSdk\Orders\OrdersCaptureRequest;
use Pterodactyl\Contracts\Repository\CreditsRepositoryInterface;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;
use Pterodactyl\Contracts\Repository\SettingsRepositoryInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\CssSelector\Exception\InternalErrorException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class PaymentController extends ClientApiController
{
    public CreditsRepositoryInterface $credits;
    public SettingsRepositoryInterface $settings;

    public function __construct(CreditsRepositoryInterface $credits, SettingsRepositoryInterface $settings)
    {
        parent::__construct();
        $this->credits = $credits;
        $this->settings = $settings;
    }

    /**
     * Constructs PayPal Order and redirects the user.
     * @param Request $request
     * @return JsonResponse
     * @throws InternalErrorException
     * @throws NotFoundHttpException
     */
    public function purchase(Request $request): JsonResponse
    {
        if ($this->credits->get('payments:enabled') === '0' || $this->credits->get('store:enabled') === '0' || $this->credits->get('credits:enabled') === '0') throw new NotFoundHttpException();
        $client = $this->getPayPalClient();
        $amount = number_format($request->json('value'));
        $cost = number_format($this->credits->get('store:credits_cost')) / 100 * $amount;
        $req = new OrdersCreateRequest();
        $req->prefer('return=representation');
        $req->body = [
            "intent" => "CAPTURE",
            "purchase_units" => [
                [
                    "reference_id" => uniqid(),
                    "description" => $amount.'Credits Purchase - '.$this->settings->get('settings::app:name'),
                    "amount" => [
                        "value" => $cost,
                        'currency_code' => strtoupper($this->credits->get('payments:currency', 'USD')),
                        'breakdown' => [
                            'item_total' => ['currency_code' => strtoupper($this->credits->get('payments:currency', 'USD')), 'value' => $cost]
                        ]
                    ]
                ]
            ],
            "application_context" => [
                "cancel_url" => route('api.client.callback.cancel'),
                "return_url" => route('api.client.callback.success'),
                'brand_name' => $this->settings->get('settings::app:name'),
                'shipping_preference'  => 'NO_SHIPPING'
            ]
        ];

        try {
            $res = $client->execute($req);
            return new JsonResponse($res->result->links[1]->href, 200, [], null, true);
        } catch (HttpException|IOException $ex) {
            if (env('APP_ENV') === 'local') dd(json_decode($ex->getMessage())); else throw new InternalErrorException();
        }
    }

    /**
     * Callback for when a payment is successful.
     * @param Request $request
     * @return RedirectResponse
     * @throws InternalErrorException
     * @throws BadRequestHttpException
     */
    public function success(Request $request): RedirectResponse
    {
        $client = $this->getPayPalClient();
        try {
            $req = new OrdersCaptureRequest($request->input('token'));
            $req->prefer('return=representation');
            $res = $client->execute($req);
            if ($res->statusCode === 200|201) {
                $userBalRaw = DB::table('users')->select('cr_balance')->where('id', '=', $request->user()->id)->get();
                DB::table('users')->where('id', '=', $request->user()->id)->update(['cr_balance' => $userBalRaw[0]->cr_balance + 100]);
                return redirect('/store/payment/success')->with('data', ['id' => $res->result->id, 'status' => $res->result->status, 'timestamp' => $res->result->purchase_units[0]->payments->captures[0]->create_time]);
            } else {
                throw new BadRequestHttpException();
            }
        } catch (HttpException|IOException $ex) {
            if (env('APP_ENV') === 'local') dd(json_decode($ex->getMessage())); else throw new InternalErrorException();
        }
    }

    /**
     * Callback for when a payment is cancelled.
     * @return RedirectResponse
     */
    public function cancel(): RedirectResponse
    {
        return redirect('/store/payment/cancel');
    }

    /**
     * Returns a PayPal Http Client.
     * @return PayPalHttpClient
     */
    protected function getPayPalClient(): PayPalHttpClient
    {
        $environment = env('APP_ENV') == 'local' ? new SandboxEnvironment($this->credits->get('payments:paypal_id'), $this->credits->get('payments:paypal_secret')) : new ProductionEnvironment($this->credits->get('payments:paypal_id'), $this->credits->get('payments:paypal_secret'));
        return new PayPalHttpClient($environment);
    }
}
