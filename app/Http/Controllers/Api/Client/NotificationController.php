<?php

namespace Pterodactyl\Http\Controllers\Api\Client;

use Illuminate\Http\Request;
use Pterodactyl\Transformers\Api\Client\NotificationTransformer;

class NotificationController extends ClientApiController
{
    /**
     * NotificationController constructor.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Get all notifications a user owns and return them.
     */
    public function index(Request $request): array
    {
        return $this->fractal->item($request->user()->notifications)
            ->transformWith($this->getTransformer(NotificationTransformer::class))
            ->toArray();
    }
}
