<?php

namespace Pterodactyl\Extensions\League\Fractal\Serializers;

use League\Fractal\Serializer\ArraySerializer;

class PterodactylSerializer extends ArraySerializer
{
    /**
     * Serialize an item.
     *
     * @param string $resourceKey
     *
     * @return array
     */
    public function item($resourceKey, array $data): array
    {
        return [
            'object' => $resourceKey,
            'attributes' => $data,
        ];
    }

    /**
     * Serialize a collection.
     *
     * @param string $resourceKey
     *
     * @return array
     */
    public function collection($resourceKey, array $data): array
    {
        $response = [];
        foreach ($data as $datum) {
            $response[] = $this->item($resourceKey, $datum);
        }

        return [
            'object' => 'list',
            'data' => $response,
        ];
    }

    /**
     * Serialize a null resource.
     *
     * @return array
     */
    public function null(): array
    {
        return [
            'object' => 'null_resource',
            'attributes' => null,
        ];
    }

    /**
     * Merge the included resources with the parent resource being serialized.
     *
     * @param array $transformedData
     * @param array $includedData
     *
     * @return array
     */
    public function mergeIncludes($transformedData, $includedData): array
    {
        foreach ($includedData as $key => $datum) {
            $transformedData['relationships'][$key] = $datum;
        }

        return $transformedData;
    }
}
