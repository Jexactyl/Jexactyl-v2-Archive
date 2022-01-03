<?php

namespace Pterodactyl\Http\Controllers\Admin;

use Illuminate\Support\Facades\DB;
use Pterodactyl\Http\Controllers\Controller;

class LogsController extends Controller
{
    public function index()
    {
        $logs = DB::table('audit_logs')->orderBy('id', 'DESC')->get();
        $logs = json_decode(json_encode($logs), true);
        return view('admin.logs.index', [
            'logs' => $logs,
        ]);
    }
}
