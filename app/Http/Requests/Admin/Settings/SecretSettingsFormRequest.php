<?php

namespace Pterodactyl\Http\Requests\Admin\Settings;

use Illuminate\Validation\Rule;
use Pterodactyl\Traits\Helpers\AvailableLanguages;
use Pterodactyl\Http\Requests\Admin\AdminFormRequest;

class SecretSettingsFormRequest extends AdminFormRequest
{
    use AvailableLanguages;

    /**
     * @return array
     */
    public function rules()
    {
        return [
            'app:rainbow_bar' => 'nullable|integer|in:0,1',
        ];
    }
    /**
     * @return array
     */
    public function attributes()
    {
        return [
            'app:rainbow_bar' => 'Rainbow Progress Bar',
        ];
    }
}
