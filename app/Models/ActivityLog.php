<?php

namespace Pterodactyl\Models;

use Carbon\Carbon;
use LogicException;
use Illuminate\Support\Facades\Event;
use Pterodactyl\Events\ActivityLogged;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\MassPrunable;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Model as IlluminateModel;

/**
 * \Pterodactyl\Models\ActivityLog.
 *
 * @property int $id
 * @property string|null $batch
 * @property string $event
 * @property string $ip
 * @property string|null $description
 * @property string|null $actor_type
 * @property int|null $actor_id
 * @property \Illuminate\Support\Collection|null $properties
 * @property \Carbon\Carbon $timestamp
 * @property IlluminateModel|\Eloquent $actor
 * @property \Illuminate\Database\Eloquent\Collection|\Pterodactyl\Models\ActivityLogSubject[] $subjects
 * @property int|null $subjects_count
 *
 * @method static Builder|ActivityLog forActor(\Illuminate\Database\Eloquent\Model $actor)
 * @method static Builder|ActivityLog forEvent(string $action)
 * @method static Builder|ActivityLog newModelQuery()
 * @method static Builder|ActivityLog newQuery()
 * @method static Builder|ActivityLog query()
 * @method static Builder|ActivityLog whereActorId($value)
 * @method static Builder|ActivityLog whereActorType($value)
 * @method static Builder|ActivityLog whereBatch($value)
 * @method static Builder|ActivityLog whereDescription($value)
 * @method static Builder|ActivityLog whereEvent($value)
 * @method static Builder|ActivityLog whereId($value)
 * @method static Builder|ActivityLog whereIp($value)
 * @method static Builder|ActivityLog whereProperties($value)
 * @method static Builder|ActivityLog whereTimestamp($value)
 * @mixin \Eloquent
 */
class ActivityLog extends Model
{
    use MassPrunable;

    public const RESOURCE_NAME = 'activity_log';

    public $timestamps = false;

    protected $guarded = [
        'id',
        'timestamp',
    ];

    protected $casts = [
        'properties' => 'collection',
        'timestamp' => 'datetime',
    ];

    protected $with = ['subjects'];

    public static $validationRules = [
        'event' => ['required', 'string'],
        'batch' => ['nullable', 'uuid'],
        'ip' => ['required', 'string'],
        'description' => ['nullable', 'string'],
        'properties' => ['array'],
    ];

    public function actor(): MorphTo
    {
        return $this->morphTo()->withTrashed();
    }

    public function subjects()
    {
        return $this->hasMany(ActivityLogSubject::class);
    }

    public function scopeForEvent(Builder $builder, string $action): Builder
    {
        return $builder->where('event', $action);
    }

    /**
     * Scopes a query to only return results where the actor is a given model.
     */
    public function scopeForActor(Builder $builder, IlluminateModel $actor): Builder
    {
        return $builder->whereMorphedTo('actor', $actor);
    }

    /**
     * Returns models to be pruned.
     *
     * @see https://laravel.com/docs/9.x/eloquent#pruning-models
     */
    public function prunable()
    {
        if (is_null(config('activity.prune_days'))) {
            throw new LogicException('Cannot prune activity logs: no "prune_days" configuration value is set.');
        }

        return static::where('timestamp', '<=', Carbon::now()->subDays(config('activity.prune_days')));
    }

    /**
     * Boots the model event listeners. This will trigger an activity log event every
     * time a new model is inserted which can then be captured and worked with as needed.
     */
    protected static function boot()
    {
        parent::boot();

        static::created(function (self $model) {
            Event::dispatch(new ActivityLogged($model));
        });
    }
}
