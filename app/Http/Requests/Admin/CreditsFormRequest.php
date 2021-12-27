<?php

namespace Pterodactyl\Http\Requests\Admin;

class CreditsFormRequest extends AdminFormRequest
{
    public function rules()
    {
        return [
            'enabled' => 'required|bool'
        ];
    }
}