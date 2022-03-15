@extends('layouts.admin')
@include('partials/admin.credits.nav', ['activeTab' => 'store'])

@section('title')
    Store Config
@endsection

@section('content-header')
    <h1>Store Config<small>Configure the store module.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li><a href="{{ route('admin.credits') }}"></a>Credits</li>
        <li class="active">Store</li>
    </ol>
@endsection

@section('content')
    @yield('credits::nav')
    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header">
                    <h3 class="box-title">Store Module</h3>
                </div>
                <form action="{{ route('admin.credits.store') }}" method="POST">
                    <div class="box-body">
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label class="control-label" for="enabled">Status</label>
                                <select name="enabled" id="enabled" class="form-control">
                                    <option value="{{ 0 }}" @if(!$enabled) selected @endif>Disabled</option>
                                    <option value="{{ 1 }}" @if($enabled) selected @endif>Enabled</option>
                                </select>
                                <p class="text-muted"><small>When enabled, users will be able to access the store in order to buy servers and resources.</small></p>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label" for="slots_cost">Slots Cost</label>
                                <input type="text" id="slots_cost" name="slots_cost" class="form-control form-autocomplete-stop" value="{{ $slots_cost }}">
                                <p class="text-muted"><small>Credits cost per 1 slot.</small></p>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label" for="cpu_cost">CPU Cost</label>
                                <input type="text" id="cpu_cost" name="cpu_cost" class="form-control form-autocomplete-stop" value="{{ $cpu_cost }}">
                                <p class="text-muted"><small>Credits cost per 50% CPU.</small></p>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label" for="ram_cost">RAM Cost</label>
                                <input type="text" id="ram_cost" name="ram_cost" class="form-control form-autocomplete-stop" value="{{ $ram_cost }}">
                                <p class="text-muted"><small>Credits cost per 1GB RAM.</small></p>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label" for="storage_cost">Storage Cost</label>
                                <input type="text" id="storage_cost" name="storage_cost" class="form-control form-autocomplete-stop" value="{{ $storage_cost }}">
                                <p class="text-muted"><small>Credits cost per 1GB storage.</small></p>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label" for="credits_cost">Credits Cost</label>
                                <input type="text" id="credits_cost" name="credits_cost" class="form-control form-autocomplete-stop" value="{{ $credits_cost }}">
                                <p class="text-muted"><small>Cost per 100 credits.</small></p>
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
@endsection
