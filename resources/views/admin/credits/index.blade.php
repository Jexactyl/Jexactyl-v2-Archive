@extends('layouts.admin')
@include('partials/admin.credits.nav', ['activeTab' => 'config'])

@section('title')
    Credits Config
@endsection

@section('content-header')
    <h1>Credits Config<small>Configure the credits system.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Credits</li>
    </ol>
@endsection

@section('content')
    @yield('credits::nav')
    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header">
                    <h3 class="box-title">Credits System</h3>
                </div>
                <form action="{{ route('admin.credits') }}" method="POST">
                    <div class="box-body">
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label class="control-label" for="enabled">Status</label>
                                <select name="enabled" id="enabled" class="form-control">
                                    <option value="{{ 0 }}" @if(!$enabled) selected @endif>Disabled</option>
                                    <option value="{{ 1 }}" @if($enabled) selected @endif>Enabled</option>
                                </select>
                                <p class="text-muted"><small>When enabled, users will be given an amount of credits to spend at the store, if the store is also enabled.</small></p>
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
