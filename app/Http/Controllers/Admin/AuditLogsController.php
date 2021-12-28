<?php

namespace Pterodactyl\Http\Controllers\Admin;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Prologue\Alerts\AlertsMessageBag;
use Pterodactyl\Http\Controllers\Controller;
use Pterodactyl\Contracts\Repository\SettingsRepositoryInterface;
use Pterodactyl\Models\Server;

class AuditLogsController extends Controller
{
    public function index(Server $server)
    {
        $logs = DB::table('audit_logs')->orderBy('id', 'DESC')->get();
        $logs = json_decode(json_encode($logs), true);
        return view('admin.logs.index', [
            'logs' => $logs,
        ]);
    }
}
