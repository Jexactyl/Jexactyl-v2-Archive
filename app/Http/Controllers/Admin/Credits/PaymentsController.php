<?php

namespace Pterodactyl\Http\Controllers\Admin\Credits;

use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Pterodactyl\Http\Controllers\Controller;
use Pterodactyl\Exceptions\Model\DataValidationException;
use Pterodactyl\Exceptions\Repository\RecordNotFoundException;
use Pterodactyl\Http\Requests\Admin\Credits\PaymentsFormRequest;
use Pterodactyl\Contracts\Repository\CreditsRepositoryInterface;

class PaymentsController extends Controller
{
    private CreditsRepositoryInterface $credits;
    private AlertsMessageBag $alert;

    public function __construct(CreditsRepositoryInterface $credits, AlertsMessageBag $alert)
    {
        $this->credits = $credits;
        $this->alert = $alert;
    }

    public function index(): View
    {
        return view('admin.credits.payments', [
            'enabled' => $this->credits->get('payments:enabled', false),
            'paypal_id' => $this->credits->get('payments:paypal_id', ''),
            'paypal_secret' => $this->credits->get('payments:paypal_secret', ''),
            'currency' => $this->credits->get('payments:currency', 'USD')
        ]);
    }

    /**
     * @throws DataValidationException
     * @throws RecordNotFoundException
     */
    public function update(PaymentsFormRequest $request): RedirectResponse
    {
        foreach ($request->normalize() as $key => $value) {
            $this->credits->set('payments:'.$key, $value);
        }

        $this->alert->success('Payments System has been updated.')->flash();

        return redirect()->route('admin.credits.payments');
    }
}
