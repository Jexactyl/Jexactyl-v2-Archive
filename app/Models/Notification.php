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

    public const ACCOUNT__EMAIL_UPDATE = 'Email has been updated.';
    public const ACCOUNT__PASSWORD_UPDATE = 'Password has been updated.';
    public const ACCOUNT__USERNAME_UPDATE = 'Username has been updated.';

    public const ACCOUNT__APIKEY_CREATE = 'API Key has been created.';
    public const ACCOUNT__APIKEY_DELETE = 'API Key has been deleted.';

    public const ACCOUNT__2FA_ENABLE = '2FA has been enabled.';
    public const ACCOUNT__2FA_DISABLE = '2FA has been disabled.';

    public const ACCOUNT__SECURITYKEY_CREATE = 'A security key has been created.';
    public const ACCOUNT__SECURITYKEY_DELETE = 'A security key has been deleted.';


    /**
     * @var string[]
     */
    public static $validationRules = [
        'user_id' => 'integer',
        'server_id' => 'nullable|integer',
        'action' => 'string|max:191',
        'created' => 'string',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['user_id', 'server_id', 'action', 'created'];

    /**
     * @var string
     */
    protected $table = 'notification';

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
    public static function instance(string $action, string $created)
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
            'created' => $created,
        ]);
    }
}
