@extends('layouts.admin')

@section('title')
    Store
@endsection

@section('content-header')
    <h1>Store<small>Configure the store for users to purchase servers with credits.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Store</li>
    </ol>
@endsection

@section('content')
    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">Store Settings</h3>
                </div>
                <form><!-- action="{{ route('admin.store') }}" method="POST" -->
                    <div class="box-body">
                        <div class="form-group col-md-4">
                            <label class="control-label">Status</label>
                            <div>
                                <select name="config:enabled" class="form-control">
                                    <option value="{{ 0 }}" @if(!$enabled) selected @endif>Disabled</option>
                                    <option value="{{ 1 }}" @if($enabled) selected @endif>Enabled</option>
                                </select>
                                <p class="text-muted"><small>When enabled, users will have access to the store.</small></p>
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
