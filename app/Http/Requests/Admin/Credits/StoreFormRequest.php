<?php

namespace Pterodactyl\Http\Requests\Admin\Credits;

use Pterodactyl\Http\Requests\Admin\AdminFormRequest;

class StoreFormRequest extends AdminFormRequest
{
    /**
     * @return array
     */
    public function rules(): array
    {
        return [
            'enabled' => 'int|nullable',
            'slots_cost' => 'int|nullable',
            'cpu_cost' => 'int|nullable',
            'ram_cost' => 'int|nullable',
            'storage_cost' => 'int|nullable',
            'credits_cost' => 'string|nullable'
        ];
    }
}
