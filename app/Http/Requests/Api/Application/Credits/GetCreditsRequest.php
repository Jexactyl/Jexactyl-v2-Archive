<?php

namespace Pterodactyl\Http\Requests\Api\Application\Credits;

use Pterodactyl\Services\Acl\Api\AdminAcl as Acl;
use Pterodactyl\Http\Requests\Api\Application\ApplicationApiRequest;

class GetCreditsRequest extends ApplicationApiRequest
{
    /**
     * @var string
     */
    protected $resource = Acl::RESOURCE_CREDITS;

    /**
     * @var int
     */
    protected $permission = Acl::READ;
}
