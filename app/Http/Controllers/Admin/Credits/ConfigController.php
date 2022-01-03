<?php

namespace Pterodactyl\Http\Controllers\Admin\Credits;

use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Pterodactyl\Http\Controllers\Controller;
use Pterodactyl\Exceptions\Model\DataValidationException;
use Pterodactyl\Exceptions\Repository\RecordNotFoundException;
use Pterodactyl\Http\Requests\Admin\Credits\ConfigFormRequest;
use Pterodactyl\Contracts\Repository\CreditsRepositoryInterface;

class ConfigController extends Controller
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
        return view('admin.credits.index', [
            'enabled' => $this->credits->get('config:enabled', false),
        ]);
    }

    /**
     * @throws DataValidationException
     * @throws RecordNotFoundException
     */
    public function update(ConfigFormRequest $request): RedirectResponse
    {
        foreach ($request->normalize() as $key => $value) {
            $this->credits->set('config:'.$key, $value);
        }

        $this->alert->success('Credits System has been updated.')->flash();

        return redirect()->route('admin.credits');
    }
}
