<?php

namespace Pterodactyl\Transformers\Api\Application;

use Pterodactyl\Models\Egg;
use Pterodactyl\Models\Nest;
use Pterodactyl\Models\Server;
use Pterodactyl\Services\Acl\Api\AdminAcl;

class NestTransformer extends BaseTransformer
{
    /**
     * Relationships that can be loaded onto this transformation.
     */
    protected array $availableIncludes = [
        'eggs', 'servers',
    ];

    /**
     * Return the resource name for the JSONAPI output.
     */
    public function getResourceName(): string
    {
        return Nest::RESOURCE_NAME;
    }

    /**
     * Transform a Nest model into a representation that can be consumed by the
     * application API.
     *
     * @return array
     */
    public function transform(Nest $model)
    {
        $response = $model->toArray();

        $response[$model->getUpdatedAtColumn()] = $this->formatTimestamp($model->updated_at);
        $response[$model->getCreatedAtColumn()] = $this->formatTimestamp($model->created_at);

        return $response;
    }

    /**
     * Include the Eggs relationship on the given Nest model transformation.
     *
     * @return \League\Fractal\Resource\Collection|\League\Fractal\Resource\NullResource
     *
     * @throws \Pterodactyl\Exceptions\Transformer\InvalidTransformerLevelException
     */
    public function includeEggs(Nest $model)
    {
        if (!$this->authorize(AdminAcl::RESOURCE_EGGS)) {
            return $this->null();
        }

        $model->loadMissing('eggs');

        return $this->collection($model->getRelation('eggs'), $this->makeTransformer(EggTransformer::class), Egg::RESOURCE_NAME);
    }

    /**
     * Include the servers relationship on the given Nest model.
     *
     * @return \League\Fractal\Resource\Collection|\League\Fractal\Resource\NullResource
     *
     * @throws \Pterodactyl\Exceptions\Transformer\InvalidTransformerLevelException
     */
    public function includeServers(Nest $model)
    {
        if (!$this->authorize(AdminAcl::RESOURCE_SERVERS)) {
            return $this->null();
        }

        $model->loadMissing('servers');

        return $this->collection($model->getRelation('servers'), $this->makeTransformer(ServerTransformer::class), Server::RESOURCE_NAME);
    }
}
