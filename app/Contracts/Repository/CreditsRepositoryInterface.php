<?php

namespace Pterodactyl\Contracts\Repository;

use Pterodactyl\Exceptions\Model\DataValidationException;
use Pterodactyl\Exceptions\Repository\RecordNotFoundException;

interface CreditsRepositoryInterface extends RepositoryInterface
{
    /**
     * Store a new persistent setting in the database.
     *
     * @throws DataValidationException
     * @throws RecordNotFoundException
     */
    public function set(string $key, string $value = null);

    /**
     * Retrieve a persistent setting from the database.
     *
     * @param mixed $default
     * @return mixed
     */
    public function get(string $key, $default);

    /**
     * Remove a key from the database cache.
     */
    public function forget(string $key);
}
