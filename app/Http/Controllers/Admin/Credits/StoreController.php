<?php

namespace Pterodactyl\Http\Controllers\Admin\Credits;

use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Pterodactyl\Http\Controllers\Controller;
use Pterodactyl\Exceptions\Model\DataValidationException;
use Pterodactyl\Http\Requests\Admin\Credits\StoreFormRequest;
use Pterodactyl\Exceptions\Repository\RecordNotFoundException;
use Pterodactyl\Contracts\Repository\CreditsRepositoryInterface;

class StoreController extends Controller
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
        return view('admin.credits.store', [
            'enabled' => $this->credits->get('store:enabled', false),
            'cpu_cost' => $this->credits->get('store:cpu_cost', 20)
        ]);
    }

    /**
     * @throws DataValidationException
     * @throws RecordNotFoundException
     */
    public function update(StoreFormRequest $request): RedirectResponse
    {
        foreach ($request->normalize() as $key => $value) {
            $this->credits->set('store:'.$key, $value);
        }

        $this->alert->success('Store module has been updated.')->flash();

        return redirect()->route('admin.credits.store');
    }
}
