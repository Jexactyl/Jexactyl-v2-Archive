@section('users::nav')
    <div class="row">
        <div class="col-xs-12">
            <div class="nav-tabs-custom nav-tabs-floating">
                <ul class="nav nav-tabs">
                    <li @if($activeTab === 'view')class="active"@endif><a href="{{ route('admin.users.view', ['user' => $user]) }}">Profile</a></li>
                    <li @if($activeTab === 'resources')class="active"@endif><a href="{{ route('admin.users.store', ['user' => $user]) }}">Resources</a></li>
                </ul>
            </div>
        </div>
    </div>
@endsection
