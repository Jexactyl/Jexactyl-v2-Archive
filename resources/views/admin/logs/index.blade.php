@extends('layouts.admin')

@section('title')
    Audit Logs
@endsection

@section('content-header')
    <h1>Audit Logs <small>You can view changes on all servers.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Audit Logs</li>
    </ol>
@endsection

@section('content')
<div class="row">
    <div class="col-xs-12">
        <div class="box box-primary">
            <div class="box-header with-border">
                <h3 class="box-title">Audit Logs</h3>
            </div>
            <div class="box-body table-responsive no-padding">
                 <table class="table table-hover">
                    <tbody>
                        <tr>
                            <th>User ID</th>
			                <th>Date</th>
                            <th>Server</th>
                            <th>Actions</th>
                            <th>Files</th>
                        </tr>
                        @foreach ($logs as $logs)
                            <tr>
                                <td>{{$logs['user_id']}}</td>
                                <td>{{$logs['created_at']}}</td>
                                <td>{{$logs['server_id']}}</td>
                                <td>{{$logs['action']}}</td>
                                <td>{{$logs['metadata']}}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection
