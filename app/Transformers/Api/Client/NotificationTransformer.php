<?php

namespace Pterodactyl\Transformers\Api\Client;

use Pterodactyl\Models\Notification;

class NotificationTransformer extends BaseClientTransformer
{
    /**
     * Return the resource name for the JSONAPI output.
     */
    public function getResourceName(): string
    {
        return Notification::RESOURCE_NAME;
    }

    /**
     * Return the notifications for the current user.
     * 
     * @return array
     */
    public function transform(Notification $model)
    {
        return [
            'id' => $model->id,
            'user_id' => $model->user_id,
            'server_id' => $model->server_id,
            'action' => $model->action,
            'created' => $model->created,
        ];
    }
}
