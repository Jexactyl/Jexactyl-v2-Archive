@extends('layouts.admin')
@include('partials/admin.settings.nav', ['activeTab' => 'basic'])

@section('title')
    Settings
@endsection

@section('content-header')
    <h1>Panel Settings<small>Configure Pterodactyl to your liking.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Settings</li>
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
                <form action="{{ route('admin.settings') }}" method="POST">
                    <div class="box-body">
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label class="control-label">Company Name</label>
                                <div>
                                    <input type="text" class="form-control" name="app:name" value="{{ old('app:name', config('app.name')) }}" />
                                    <p class="text-muted"><small>This is the name that is used throughout the panel and in emails sent to clients.</small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Require 2-Factor Authentication</label>
                                <div>
                                    <div class="btn-group" data-toggle="buttons">
                                        @php
                                            $level = old('pterodactyl:auth:2fa_required', config('pterodactyl.auth.2fa_required'));
                                        @endphp
                                        <label class="btn btn-primary @if ($level == 0) active @endif">
                                            <input type="radio" name="pterodactyl:auth:2fa_required" autocomplete="off" value="0" @if ($level == 0) checked @endif> Not Required
                                        </label>
                                        <label class="btn btn-primary @if ($level == 1) active @endif">
                                            <input type="radio" name="pterodactyl:auth:2fa_required" autocomplete="off" value="1" @if ($level == 1) checked @endif> Admin Only
                                        </label>
                                        <label class="btn btn-primary @if ($level == 2) active @endif">
                                            <input type="radio" name="pterodactyl:auth:2fa_required" autocomplete="off" value="2" @if ($level == 2) checked @endif> All Users
                                        </label>
                                    </div>
                                    <p class="text-muted"><small>If enabled, any account falling into the selected grouping will be required to have 2-Factor authentication enabled to use the Panel.</small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Default Language</label>
                                <div>
                                    <select name="app:locale" class="form-control">
                                        @foreach($languages as $key => $value)
                                            <option value="{{ $key }}" @if(config('app.locale') === $key) selected @endif>{{ $value }}</option>
                                        @endforeach
                                    </select>
                                    <p class="text-muted"><small>The default language to use when rendering UI components.</small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">User Registration</label>
                                <div>
                                    <select name="app:user_registration" class="form-control">
                                        <option value="{{ 0 }}" @if(!$registration) selected @endif>Disabled</option>
                                        <option value="{{ 1 }}" @if($registration) selected @endif>Enabled</option>
                                    </select>
                                    <p class="text-muted"><small>If enabled, users will be able to register accounts.</small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Username Editing</label>
                                <div>
                                    <select name="app:username_edit" class="form-control">
                                        <option value="{{ 0 }}" @if(!$username_edit) selected @endif>Disabled</option>
                                        <option value="{{ 1 }}" @if($username_edit) selected @endif>Enabled</option>
                                    </select>
                                    <p class="text-muted"><small>If enabled, users will be able to edit their username from the frontend.</small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Particles</label>
                                <div>
                                    <select name="app:particles" class="form-control">
                                    <option value="{{ 0 }}" @if(!$particles) selected @endif>Disabled</option>
                                        <option value="{{ 1 }}" @if($particles) selected @endif>Enabled</option>
                                    </select>
                                    <p class="text-muted"><small>If enabled, particle effects will be displayed in the login menus.</small></p>
                                </div>
                            </div>
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
