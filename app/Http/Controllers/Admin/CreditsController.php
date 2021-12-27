<?php

namespace Pterodactyl\Http\Controllers\Admin;

use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Illuminate\Contracts\Console\Kernel;
use Pterodactyl\Http\Requests\Admin\CreditsFormRequest;
use Pterodactyl\Exceptions\Model\DataValidationException;
use Pterodactyl\Exceptions\Repository\RecordNotFoundException;
use Pterodactyl\Contracts\Repository\CreditsRepositoryInterface;
use Pterodactyl\Http\Controllers\Controller;

class CreditsController extends Controller
{
    private CreditsRepositoryInterface $credits;
    private Kernel $kernel;
    private AlertsMessageBag $alert;

    public function __construct(CreditsRepositoryInterface $credits, Kernel $kernel, AlertsMessageBag $alert) 
    {
        $this->credits = $credits;
        $this->kernel = $kernel;
        $this->alert = $alert;
    }

    public function index(): View
    {
        return view('admin.credits.index', [
            'credits' => $this->credits,
            'enabled' => $this->credits->get('enabled', true),
        ]);
    }

    /**
     * @throws DataValidationException
     * @throws RecordNotFoundException
     */
    public function update(CreditsFormRequest $request): RedirectResponce
    {
        foreach ($request->normalize() as $key => $value) {
            $this->credits->set('config:'.$key, $value);
        }

        $this->kernel->call('queue:restart');
        $this->alert->success('The credits system has been updated and the queue worker has been restarted.');

        return redirect()->route('admin.credits');
    }
}