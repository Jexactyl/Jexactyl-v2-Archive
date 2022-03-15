<?php

namespace Pterodactyl\Http\Requests\Admin\Users;

use Illuminate\Support\Collection;
use Pterodactyl\Http\Requests\Admin\AdminFormRequest;
use Pterodactyl\Models\User;

class UserResourceFormRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return Collection::make(User::getRulesForUpdate($this->route()->parameter('user')))->only([
            'cr_balance',
            'cr_cpu',
            'cr_ram',
            'cr_storage',
            'cr_slots'
        ])->toArray();
    }
}
