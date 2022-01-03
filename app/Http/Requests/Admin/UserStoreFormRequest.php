<?php

namespace Pterodactyl\Http\Requests\Admin;

use Pterodactyl\Models\User;
use Illuminate\Support\Collection;

class UserStoreFormRequest extends AdminFormRequest
{
    /**
     * Rules to apply to requests for updating or creating a user
     * in the Admin CP.
     */
    public function rules()
    {
        return Collection::make(
            User::getRulesForUpdate($this->route()->parameter('user'))
        )->only([
            'cr_balance',
            'cr_cpu',
            'cr_ram',
            'cr_storage',
        ])->toArray();
    }
}
