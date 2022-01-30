<?php

namespace Pterodactyl\Http\Requests\Admin\Credits;

use Pterodactyl\Http\Requests\Admin\AdminFormRequest;

class PaymentsFormRequest extends AdminFormRequest
{
    /**
     * @return array
     */
    public function rules(): array
    {
        return [
            'enabled' => 'int',
            'paypal_id' => 'string',
            'paypal_secret' => 'string',
            'currency' => 'string'
        ];
    }
}
