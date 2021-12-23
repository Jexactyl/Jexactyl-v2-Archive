@extends('layouts.admin')
@include('partials/admin.settings.nav', ['activeTab' => 'secret'])

@section('title')
    Super Secret Settings
@endsection

@section('content-header')
    <h1>Secret Settings<small>Configure some super secret settings.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">???</li>
    </ol>
@endsection

@section('content')
    @yield('settings::nav')
    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">Panel Settings</h3>
                </div>
                <form action="" method="POST">
                    <div class="box-body">
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label class="control-label">Rainbow Progress Bar</label>
                                <div>
                                    <select name="app:rainbow_bar" class="form-control">
                                    <option value="{{ 0 }}" @if(!$rainbow_bar) selected @endif>Disabled</option>
                                        <option value="{{ 1 }}" @if($rainbow_bar) selected @endif>Enabled</option>
                                    </select>
                                    <p class="text-muted"><small>If enabled, the loading bar will be rainbow!</small></p>
                                </div>
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
