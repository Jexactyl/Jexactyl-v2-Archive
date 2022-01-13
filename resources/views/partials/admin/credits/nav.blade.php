@section('credits::nav')
    <div class="row">
        <div class="col-xs-12">
            <div class="nav-tabs-custom nav-tabs-floating">
                <ul class="nav nav-tabs">
                    <li @if($activeTab === 'config')class="active"@endif><a href="{{ route('admin.users.view') }}">Config</a></li>
                    <li @if($activeTab === 'store')class="active"@endif><a href="{{ route('admin.users.store') }}">Store</a></li>
                </ul>
            </div>
        </div>
    </div>
@endsection
