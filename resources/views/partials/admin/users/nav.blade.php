@section('users::nav')
    <div class="row">
        <div class="col-xs-12">
            <div class="nav-tabs-custom nav-tabs-floating">
                <ul class="nav nav-tabs">
                    <li @if($activeTab === 'view')class="active"@endif><a href="{{ route('admin.users.view', ['user' => $user]) }}">User Details</a></li>
                    <li @if($activeTab === 'store')class="active"@endif><a href="{{ route('admin.users.store', ['user' => $user]) }}">Resource Details</a></li>
                </ul>
            </div>
        </div>
    </div>
@endsection
