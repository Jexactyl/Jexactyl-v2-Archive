<?php

namespace Pterodactyl\Http\Requests\Admin;

use Pterodactyl\Http\Requests\Admin\AdminFormRequest;

class BillingFormRequest extends AdminFormRequest
{
    /**
     * @return array
     */
    public function rules(): array
    {
        return [
            'enabled' => 'int',
        ];
    }
}
