<?php

namespace Pterodactyl\Http\Requests\Api\Client;

class StoreRequest extends ClientApiRequest
{
    public function authorize(): bool
    {
        return true;
    }
}
