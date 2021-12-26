<?php

namespace Pterodactyl\Repositories\Eloquent;

use Pterodactyl\Models\Credits;
use Pterodactyl\Contracts\Repository\CreditsRepositoryInterface;

class CreditsRepository extends EloquentRepository implements CreditsRepositoryInterface
{
    /**
     * Return the model backing this repository.
     *
     * @return string
     */
    public function model()
    {
        return Credits::class;
    }
}
