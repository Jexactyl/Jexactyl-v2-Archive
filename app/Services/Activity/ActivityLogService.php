<?php

namespace Pterodactyl\Services\Activity;

use Illuminate\Support\Arr;
use Webmozart\Assert\Assert;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Pterodactyl\Models\ActivityLog;
use Illuminate\Contracts\Auth\Factory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Request;
use Pterodactyl\Models\ActivityLogSubject;
use Illuminate\Database\ConnectionInterface;

class ActivityLogService
{
    protected ?ActivityLog $activity = null;

    protected array $subjects = [];

    protected Factory $manager;

    protected ConnectionInterface $connection;

    protected AcitvityLogBatchService $batch;

    protected ActivityLogTargetableService $targetable;

    public function __construct(
        Factory $manager,
        AcitvityLogBatchService $batch,
        ActivityLogTargetableService $targetable,
        ConnectionInterface $connection
    ) {
        $this->manager = $manager;
        $this->batch = $batch;
        $this->targetable = $targetable;
        $this->connection = $connection;
    }

    /**
     * Sets the activity logger as having been caused by an anonymous
     * user type.
     */
    public function anonymous(): self
    {
        $this->getActivity()->actor_id = null;
        $this->getActivity()->actor_type = null;
        $this->getActivity()->setRelation('actor', null);

        return $this;
    }

    /**
     * Sets the action for this activity log.
     */
    public function event(string $action): self
    {
        $this->getActivity()->event = $action;

        return $this;
    }

    /**
     * Set the description for this activity.
     */
    public function description(?string $description): self
    {
        $this->getActivity()->description = $description;

        return $this;
    }

    /**
     * Sets the subject model instance.
     *
     * @param \Illuminate\Database\Eloquent\Model|\Illuminate\Database\Eloquent\Model[] $subjects
     */
    public function subject(...$subjects): self
    {
        foreach (Arr::wrap($subjects) as $subject) {
            foreach ($this->subjects as $entry) {
                // If this subject is already tracked in our array of subjects just skip over
                // it and move on to the next one in the list.
                if ($entry->is($subject)) {
                    continue 2;
                }
            }

            $this->subjects[] = $subject;
        }

        return $this;
    }

    /**
     * Sets the actor model instance.
     */
    public function actor(Model $actor): self
    {
        $this->getActivity()->actor()->associate($actor);

        return $this;
    }

    /**
     * Sets a custom property on the activty log instance.
     *
     * @param string|array $key
     * @param mixed $value
     */
    public function property($key, $value = null): self
    {
        $properties = $this->getActivity()->properties;
        $this->activity->properties = is_array($key)
            ? $properties->merge($key)
            : $properties->put($key, $value);

        return $this;
    }

    /**
     * Attachs the instance request metadata to the activity log event.
     */
    public function withRequestMetadata(): self
    {
        return $this->property([
            'ip' => Request::getClientIp(),
            'useragent' => Request::userAgent(),
        ]);
    }

    /**
     * Logs an activity log entry with the set values and then returns the
     * model instance to the caller. If there is an exception encountered while
     * performing this action it will be logged to the disk but will not interrupt
     * the code flow.
     */
    public function log(string $description = null): ActivityLog
    {
        $activity = $this->getActivity();

        if (!is_null($description)) {
            $activity->description = $description;
        }

        try {
            return $this->save();
        } catch (\Throwable|\Exception $exception) {
            if (config('app.env') !== 'production') {
                /* @noinspection PhpUnhandledExceptionInspection */
                throw $exception;
            }

            Log::error($exception);
        }

        return $activity;
    }

    /**
     * Returns a cloned instance of the service allowing for the creation of a base
     * activity log with the ability to change values on the fly without impact.
     */
    public function clone(): self
    {
        return clone $this;
    }

    /**
     * Executes the provided callback within the scope of a database transaction
     * and will only save the activity log entry if everything else succesfully
     * settles.
     *
     * @return mixed
     *
     * @throws \Throwable
     */
    public function transaction(\Closure $callback)
    {
        return $this->connection->transaction(function () use ($callback) {
            $response = $callback($this);

            $this->save();

            return $response;
        });
    }

    /**
     * Resets the instance and clears out the log.
     */
    public function reset(): void
    {
        $this->activity = null;
        $this->subjects = [];
    }

    /**
     * Returns the current activity log instance.
     */
    protected function getActivity(): ActivityLog
    {
        if ($this->activity) {
            return $this->activity;
        }

        $this->activity = new ActivityLog([
            'ip' => Request::ip(),
            'batch_uuid' => $this->batch->uuid(),
            'properties' => Collection::make([]),
        ]);

        if ($subject = $this->targetable->subject()) {
            $this->subject($subject);
        }

        if ($actor = $this->targetable->actor()) {
            $this->actor($actor);
        } elseif ($user = $this->manager->guard()->user()) {
            if ($user instanceof Model) {
                $this->actor($user);
            }
        }

        return $this->activity;
    }

    /**
     * Saves the activity log instance and attaches all of the subject models.
     *
     * @throws \Throwable
     */
    protected function save(): ActivityLog
    {
        Assert::notNull($this->activity);

        $response = $this->connection->transaction(function () {
            $this->activity->save();

            $subjects = Collection::make($this->subjects)
                ->map(fn (Model $subject) => [
                    'activity_log_id' => $this->activity->id,
                    'subject_id' => $subject->getKey(),
                    'subject_type' => $subject->getMorphClass(),
                ])
                ->values()
                ->toArray();

            ActivityLogSubject::insert($subjects);

            return $this->activity;
        });

        $this->activity = null;
        $this->subjects = [];

        return $response;
    }
}
