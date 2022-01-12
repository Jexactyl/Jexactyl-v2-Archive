<?php

namespace Pterodactyl\Transformers\Api\Client;

use Pterodactyl\Models\User;

class AccountTransformer extends BaseClientTransformer
{
    /**
     * Return the resource name for the JSONAPI output.
     */
    public function getResourceName(): string
    {
        return 'user';
    }

    /**
     * Return basic information about the currently logged in user.
     *
     * @return array
     */
    public function transform(User $model)
    {
        return [
            'id' => $model->id,
            'admin' => $model->root_admin,
            'username' => $model->username,
            'email' => $model->email,
            'first_name' => $model->name_first,
            'last_name' => $model->name_last,
            'cr_balance' => $model->cr_balance,
            'cr_slots' => $model->cr_slots,
            'cr_cpu' => $model->cr_cpu,
            'cr_ram' => $model->cr_ram,
            'cr_storage' => $model->cr_storage,
            'language' => $model->language,
        ];
    }
}
