<?php

namespace Pterodactyl\Models;

use Illuminate\Container\Container;
use Pterodactyl\Contracts\Extensions\HashidsInterface;

/**
 * @property int $id
 * @property int $server_id
 * @property int $database_host_id
 * @property string $database
 * @property string $username
 * @property string $remote
 * @property string $password
 * @property int $max_connections
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \Pterodactyl\Models\Server $server
 * @property \Pterodactyl\Models\DatabaseHost $host
 */
class Database extends Model
{
    /**
     * The resource name for this model when it is transformed into an
     * API representation using fractal.
     */
    public const RESOURCE_NAME = 'server_database';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'databases';

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['password'];

    /**
     * Fields that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'server_id', 'database_host_id', 'database', 'username', 'password', 'remote', 'max_connections',
    ];

    /**
     * Cast values to correct type.
     *
     * @var array
     */
    protected $casts = [
        'server_id' => 'integer',
        'database_host_id' => 'integer',
        'max_connections' => 'integer',
    ];

    /**
     * @var array
     */
    public static $validationRules = [
        'server_id' => 'required|numeric|exists:servers,id',
        'database_host_id' => 'required|exists:database_hosts,id',
        'database' => 'required|string|alpha_dash|between:3,48',
        'username' => 'string|alpha_dash|between:3,100',
        'max_connections' => 'nullable|integer',
        'remote' => 'required|string|regex:/^[\w\-\/.%:]+$/',
        'password' => 'string',
    ];

    /**
     * {@inheritDoc}
     */
    public function getRouteKeyName(): string
    {
        return $this->getKeyName();
    }

    /**
     * Resolves the database using the ID by checking if the value provided is a HashID
     * string value, or just the ID to the database itself.
     *
     * @param mixed $value
     * @param string|null $field
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     *
     * @throws \Illuminate\Contracts\Container\BindingResolutionException
     */
    public function resolveRouteBinding($value, $field = null)
    {
        if (is_scalar($value) && ($field ?? $this->getRouteKeyName()) === 'id') {
            $value = ctype_digit((string) $value)
                ? $value
                : Container::getInstance()->make(HashidsInterface::class)->decodeFirst($value);
        }

        return $this->where($field ?? $this->getRouteKeyName(), $value)->firstOrFail();
    }

    /**
     * Gets the host database server associated with a database.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function host()
    {
        return $this->belongsTo(DatabaseHost::class, 'database_host_id');
    }

    /**
     * Gets the server associated with a database.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function server()
    {
        return $this->belongsTo(Server::class);
    }
}
