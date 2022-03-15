@extends('layouts.admin')
@include('partials/admin.users.nav', ['activeTab' => 'resources', 'user' => $user])

@section('title')
    Manage User: {{ $user->username }}
@endsection

@section('content-header')
    <h1>{{ $user->name_first }} {{ $user->name_last}}<small>{{ $user->username }}</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li><a href="{{ route('admin.users') }}">Users</a></li>
        <li class="{{ route('admin.users.view', ['user' => $user]) }}">{{ $user->username }}</li>
        <li class="active">Resources</li>
    </ol>
@endsection

@section('content')
    @yield('users::nav')
    <div class="row">
            <div class="col-xs-12">
                <div class="box">
                    <div class="box-header">
                        <h3 class="box-title">User Credits Settings</h3>
                    </div>
                    <form action="{{ route('admin.users.store', $user->id) }}" method="POST">
                        <div class="box-body">
                            <div class="row">
                                <div class="form-group col-md-4">
                                    <label for="cr_balance" class="control-label">Credits</label>
                                    <input type="text" id="cr_balance" value="{{ $user->cr_balance }}" name="cr_balance" class="form-control form-autocomplete-stop">
                                </div>
                                <div class="form-group col-md-4">
                                    <label for="cr_slots" class="control-label">Slots</label>
                                    <input type="text" id="cr_slots" value="{{ $user->cr_slots }}" name="cr_slots" class="form-control form-autocomplete-stop">
                                </div>
                                <div class="form-group col-md-4">
                                    <label for="cr_cpu" class="control-label">CPU</label>
                                    <input type="text" id="cr_cpu" value="{{ $user->cr_cpu }}" name="cr_cpu" class="form-control form-autocomplete-stop">
                                </div>
                                <div class="form-group col-md-4">
                                    <label for="cr_ram" class="control-label">RAM</label>
                                    <input type="text" id="cr_ram" value="{{ $user->cr_ram }}" name="cr_ram" class="form-control form-autocomplete-stop">
                                </div>
                                <div class="form-group col-md-4">
                                    <label for="cr_storage" class="control-label">Storage</label>
                                    <input type="text" id="cr_storage" value="{{ $user->cr_storage }}" name="cr_storage" class="form-control form-autocomplete-stop">
                                </div>
                            </div>
                        </div>
                        <div class="box-footer">
                            {!! csrf_field() !!}
                            <button type="submit" name="_method" value="PATCH" class="btn btn-sm btn-primary pull-right">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection
