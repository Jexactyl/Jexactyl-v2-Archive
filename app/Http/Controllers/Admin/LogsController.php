<?php

namespace Pterodactyl\Http\Controllers\Admin;

use Illuminate\Support\Facades\DB;
use Pterodactyl\Http\Controllers\Controller;
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
