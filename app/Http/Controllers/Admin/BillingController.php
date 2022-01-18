<?php

namespace Pterodactyl\Http\Controllers\Admin;

use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Prologue\Alerts\AlertsMessageBag;
use Pterodactyl\Exceptions\Model\DataValidationException;
use Pterodactyl\Exceptions\Repository\RecordNotFoundException;
use Pterodactyl\Http\Controllers\Controller;
use Pterodactyl\Contracts\Repository\BillingRepositoryInterface;
use Pterodactyl\Http\Requests\Admin\BillingFormRequest;

class BillingController extends Controller
{
    private BillingRepositoryInterface $billing;
    private AlertsMessageBag $alert;

    public function __construct(BillingRepositoryInterface $billing, AlertsMessageBag $alert)
    {
        $this->billing = $billing;
        $this->alert = $alert;
    }

    /**
     * @return View
     */
    public function index(): View
    {
        return view('admin.billing', [
            'enabled' => $this->billing->get('config:enabled', false)
        ]);
    }

    /**
     * @throws DataValidationException
     * @throws RecordNotFoundException
     */
    public function update(BillingFormRequest $request): RedirectResponse
    {
        foreach ($request->normalize() as $key => $value) {
            $this->billing->set('config:'.$key, $value);
        }

        $this->alert->success('Billing System has been updated.')->flash();

        return redirect()->route('admin.billing');
    }
}

