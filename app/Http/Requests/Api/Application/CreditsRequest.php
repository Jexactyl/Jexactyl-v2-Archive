<?php

namespace Pterodactyl\Http\Requests\Api\Application;

use Pterodactyl\Services\Acl\Api\AdminAcl;

class CreditsRequest extends ApplicationApiRequest
{
    /**
     * @var string
     */
    protected $resource = AdminAcl::RESOURCE_CREDITS;

    /**
     * @var int
     */
    protected $permission = AdminAcl::WRITE;

    /**
     * @return array
     */
    public function rules(): array
    {
        return [
            'balance' => 'int|nullable',
            'cpu' => 'int|nullable',
            'ram' => 'int|nullable',
            'storage' => 'int|nullable',
            'slots' => 'int|nullable'
        ];
    }
}
