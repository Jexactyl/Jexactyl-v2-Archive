<?php

namespace Pterodactyl\Models;

use Ramsey\Uuid\Uuid;
use Illuminate\Http\Request;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int|null $user_id
 * @property int $server_id
 * @property string $action
 * @property array $device
 * @property array $metadata
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \Pterodactyl\Models\User|null $user
 * @property \Pterodactyl\Models\Server|null $server
 */

class Notification extends Model
{
    public const RESOURCE_NAME = 'notification';

    public const ACCOUNT__EMAIL_UPDATE = 'account:email.update';

    /**
     * @var string[]
     */
    public static $validationRules = [
        'user_id' => 'nullable|integer',
        'server_id' => 'nullable|integer',
        'action' => 'nullable|string|max:191',
        'device' => 'array',
        'device.ip_address' => 'ip',
        'device.user_agent' => 'string',
        'metadata' => 'array',
    ];

    /**
     * @var string
     */
    protected $table = 'notification';

    /**
     * @var string[]
     */
    protected $casts = [
        'device' => 'array',
        'metadata' => 'array',
    ];

    /**
     * @var string[]
     */
    protected $guarded = [
        'id',
        'created_at',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Creates a new Notification model and returns it, attaching device information and the
     * currently authenticated user if available. This model is not saved at this point, so
     * you can always make modifications to it as needed before saving.
     *
     * @return $this
     */
    public static function instance(string $action)
    {
        /** @var Request $request */
        $request = Container::getInstance()->make('request');

        if (!$request instanceof Request) {
            $request = null;
        }

        return (new self())->fill([
            'user_id' => ($request && $request->user()) ? $request->user()->id : null,
            'server_id' => null,
            'action' => $action,
            'device' => $request ? [
                'ip_address' => $request->getClientIp() ?? '127.0.0.1',
                'user_agent' => $request->userAgent() ?? '',
            ] : [],
        ]);
    }
}
