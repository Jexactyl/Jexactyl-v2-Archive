<?php

namespace Pterodactyl\Http\Requests\Api\Application\Servers\Databases;

use Pterodactyl\Services\Acl\Api\AdminAcl;
use Pterodactyl\Http\Requests\Api\Application\ApplicationApiRequest;

class GetServerDatabaseRequest extends ApplicationApiRequest
{
    /**
     * @var string
     */
    protected $resource = AdminAcl::RESOURCE_SERVER_DATABASES;

    /**
     * @var int
     */
    protected $permission = AdminAcl::READ;
}
