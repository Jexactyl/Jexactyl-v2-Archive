{{-- Pterodactyl - Panel --}}
{{-- Copyright (c) 2015 - 2017 Dane Everitt <dane@daneeveritt.com> --}}

{{-- This software is licensed under the terms of the MIT license. --}}
{{-- https://opensource.org/licenses/MIT --}}
@extends('layouts.admin')

@section('title')
    Manager User: {{ $user->username }}
@endsection

@section('content-header')
    <h1>{{ $user->name_first }} {{ $user->name_last}}<small>{{ $user->username }}</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li><a href="{{ route('admin.users') }}">Users</a></li>
        <li class="active">{{ $user->username }}</li>
    </ol>
@endsection

@section('content')
<div class="row">
    <form action="{{ route('admin.users.store', $user->id) }}" method="post">
    <div class="box-body">
        <div class="row">
            <div class="form-group col-md-4">
                <label for="cr_balance" class="control-label">Credits Balance</label>
                <input type="text" id="cr_balance" value="{{ $user->cr_balance }}" name="cr_balance" class="form-control form-autocomplete-stop">
            </div>
        </div>
    </div>
    <div class="box-footer">
        {!! csrf_field() !!}
        <button type="submit" name="_method" value="PATCH" class="btn btn-sm btn-primary pull-right">Save</button>
    </div>
</div>
@endsection
