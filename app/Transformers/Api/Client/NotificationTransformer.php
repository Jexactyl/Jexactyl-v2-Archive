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
     */
    public function transform(Notification $notification): array
    {
        return [
            'id' => $notification->id,
            'user_id' => $notification->user_id,
            'server_id' => $notification->server_id,
            'action' => $notification->action,
            'device' => $notification->device,
            'metadata' => $notification->metadata,
        ];
    }
}
