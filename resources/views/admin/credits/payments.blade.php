@extends('layouts.admin')
@include('partials/admin.credits.nav', ['activeTab' => 'payments'])

@section('title')
    Payments Config
@endsection

@section('content-header')
    <h1>Payments Config<small>Configure the payment system.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Payments</li>
    </ol>
@endsection

@section('content')
    @yield('credits::nav')
    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header">
                    <h3 class="box-title">Payments Config</h3>
                </div>
                <form action="{{ route('admin.credits.payments') }}" method="POST">
                    <div class="box-body">
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label class="control-label" for="enabled">Status</label>
                                <select name="enabled" id="enabled" class="form-control">
                                    <option value="{{ 0 }}" @if(!$enabled) selected @endif>Disabled</option>
                                    <option value="{{ 1 }}" @if($enabled) selected @endif>Enabled</option>
                                </select>
                                <p class="text-muted"><small>When enabled, users will be able to purchase credits.</small></p>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label" for="currency">Status</label>
                                <select name="currency" id="currency" class="form-control">
                                    <option value="USD" @if($currency === 'USD') selected @endif>USD</option>
                                    <option value="CAD" @if($currency === 'CAD') selected @endif>CAD</option>
                                </select>
                                <p class="text-muted"><small>Change this to the currency clients will be charged in.</small></p>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label" for="paypal_id">PayPal Client ID</label>
                                <input type="text" id="paypal_id" name="paypal_id" class="form-control form-autocomplete-stop" value="{{ $paypal_id }}">
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label" for="paypal_secret">PayPal Client Secret</label>
                                <input type="password" id="paypal_secret" name="paypal_secret" class="form-control form-autocomplete-stop" value="{{ $paypal_secret }}">
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
