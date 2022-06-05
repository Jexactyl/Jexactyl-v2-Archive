<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Servers;

use Pterodactyl\Models\Server;
use Pterodactyl\Facades\Activity;
use Pterodactyl\Services\Servers\StartupCommandService;
use Pterodactyl\Services\Servers\VariableValidatorService;
use Pterodactyl\Repositories\Eloquent\ServerVariableRepository;
use Pterodactyl\Transformers\Api\Client\EggVariableTransformer;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Pterodactyl\Http\Requests\Api\Client\Servers\Startup\GetStartupRequest;
use Pterodactyl\Http\Requests\Api\Client\Servers\Startup\UpdateStartupVariableRequest;

class StartupController extends ClientApiController
{
    /**
     * @var \Pterodactyl\Services\Servers\VariableValidatorService
     */
    private $service;

    /**
     * @var \Pterodactyl\Repositories\Eloquent\ServerVariableRepository
     */
    private $repository;

    /**
     * @var \Pterodactyl\Services\Servers\StartupCommandService
     */
    private $startupCommandService;

    /**
     * StartupController constructor.
     */
    public function __construct(VariableValidatorService $service, StartupCommandService $startupCommandService, ServerVariableRepository $repository)
    {
        parent::__construct();

        $this->service = $service;
        $this->repository = $repository;
        $this->startupCommandService = $startupCommandService;
    }

    /**
     * Returns the startup information for the server including all of the variables.
     *
     * @return array
     */
    public function index(GetStartupRequest $request, Server $server)
    {
        $startup = $this->startupCommandService->handle($server, false);

        return $this->fractal->collection(
            $server->variables()->where('user_viewable', true)->get()
        )
            ->transformWith($this->getTransformer(EggVariableTransformer::class))
            ->addMeta([
                'startup_command' => $startup,
                'docker_images' => $server->egg->docker_images,
                'raw_startup_command' => $server->startup,
            ])
            ->toArray();
    }

    /**
     * Updates a single variable for a server.
     *
     * @return array
     *
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Pterodactyl\Exceptions\Model\DataValidationException
     * @throws \Pterodactyl\Exceptions\Repository\RecordNotFoundException
     */
    public function update(UpdateStartupVariableRequest $request, Server $server)
    {
        /** @var \Pterodactyl\Models\EggVariable $variable */
        $variable = $server->variables()->where('env_variable', $request->input('key'))->first();
        $original = $variable->server_value;

        if (is_null($variable) || !$variable->user_viewable) {
            throw new BadRequestHttpException('The environment variable you are trying to edit does not exist.');
        } elseif (!$variable->user_editable) {
            throw new BadRequestHttpException('The environment variable you are trying to edit is read-only.');
        }

        // Revalidate the variable value using the egg variable specific validation rules for it.
        $this->validate($request, ['value' => $variable->rules]);

        $this->repository->updateOrCreate([
            'server_id' => $server->id,
            'variable_id' => $variable->id,
        ], [
            'variable_value' => $request->input('value') ?? '',
        ]);

        $variable = $variable->refresh();
        $variable->server_value = $request->input('value');

        $startup = $this->startupCommandService->handle($server, false);

        if ($variable->env_variable !== $request->input('value')) {
            Activity::event('server:startup.edit')
                ->subject($variable)
                ->property([
                    'variable' => $variable->env_variable,
                    'old' => $original,
                    'new' => $request->input('value'),
                ])
                ->log();
        }

        return $this->fractal->item($variable)
            ->transformWith($this->getTransformer(EggVariableTransformer::class))
            ->addMeta([
                'startup_command' => $startup,
                'raw_startup_command' => $server->startup,
            ])
            ->toArray();
    }
}
