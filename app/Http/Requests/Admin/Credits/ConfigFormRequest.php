<?php

namespace Pterodactyl\Http\Requests\Admin\Credits;

use Pterodactyl\Http\Requests\Admin\AdminFormRequest;

class ConfigFormRequest extends AdminFormRequest
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
