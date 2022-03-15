<?php

namespace Pterodactyl\Http\Controllers\Admin;

use Exception;
use Illuminate\Contracts\Translation\Translator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\RedzirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\View\View;
use Prologue\Alerts\AlertsMessageBag;
use Pterodactyl\Contracts\Repository\UserRepositoryInterface;
use Pterodactyl\Exceptions\DisplayException;
use Pterodactyl\Exceptions\Model\DataValidationException;
use Pterodactyl\Exceptions\Repository\RecordNotFoundException;
use Pterodactyl\Http\Controllers\Controller;
use Pterodactyl\Http\Requests\Admin\Users\UserFormRequest;
use Pterodactyl\Http\Requests\Admin\Users\UserResourceFormRequest;
use Pterodactyl\Http\Requests\Admin\UserStoreFormRequest;
use Pterodactyl\Models\Model;
use Pterodactyl\Models\User;
use Pterodactyl\Services\Users\UserCreationService;
use Pterodactyl\Services\Users\UserDeletionService;
use Pterodactyl\Services\Users\UserUpdateService;
use Pterodactyl\Traits\Helpers\AvailableLanguages;
use Spatie\QueryBuilder\QueryBuilder;
use Throwable;

class UserController extends Controller
{
    use AvailableLanguages;

    /**
     * @var AlertsMessageBag
     */
    protected $alert;

    /**
     * @var UserCreationService
     */
    protected $creationService;

    /**
     * @var UserDeletionService
     */
    protected $deletionService;

    /**
     * @var UserRepositoryInterface
     */
    protected $repository;

    /**
     * @var Translator
     */
    protected $translator;

    /**
     * @var UserUpdateService
     */
    protected $updateService;

    /**
     * UserController constructor.
     */
    public function __construct(
        AlertsMessageBag $alert,
        UserCreationService $creationService,
        UserDeletionService $deletionService,
        Translator $translator,
        UserUpdateService $updateService,
        UserRepositoryInterface $repository
    )
    {
        $this->alert = $alert;
        $this->creationService = $creationService;
        $this->deletionService = $deletionService;
        $this->repository = $repository;
        $this->translator = $translator;
        $this->updateService = $updateService;
    }

    /**
     * Display user index page.
     *
     * @return View
     */
    public function index(Request $request)
    {
        $users = QueryBuilder::for(
            User::query()->select('users.*')
                ->selectRaw('COUNT(DISTINCT(subusers.id)) as subuser_of_count')
                ->selectRaw('COUNT(DISTINCT(servers.id)) as servers_count')
                ->leftJoin('subusers', 'subusers.user_id', '=', 'users.id')
                ->leftJoin('servers', 'servers.owner_id', '=', 'users.id')
                ->groupBy('users.id')
        )
            ->allowedFilters(['username', 'email', 'uuid'])
            ->allowedSorts(['id', 'uuid'])
            ->paginate(50);

        return view('admin.users.index', ['users' => $users]);
    }

    /**
     * Display new user page.
     *
     * @return View
     */
    public function create()
    {
        return view('admin.users.new', [
            'languages' => $this->getAvailableLanguages(true),
        ]);
    }

    /**
     * Display user view page.
     *
     * @param User $user
     * @return View
     */
    public function view(User $user): View
    {
        return view('admin.users.view', [
            'user' => $user,
            'languages' => $this->getAvailableLanguages(true),
        ]);
    }

    /**
     * Display the user resource page.
     * @param User $user
     * @return View
     */
    public function resources(User $user): View
    {
        return view('admin.users.resources', [
            'user' => $user,
        ]);
    }

    /**
     * Delete a user from the system.
     *
     * @return RedirectResponse
     *
     * @throws Exception
     * @throws DisplayException
     */
    public function delete(Request $request, User $user)
    {
        if ($request->user()->id === $user->id) {
            throw new DisplayException($this->translator->get('admin/user.exceptions.user_has_servers'));
        }

        $this->deletionService->handle($user);

        return redirect()->route('admin.users');
    }

    /**
     * Create a user.
     *
     * @return RedirectResponse
     *
     * @throws Exception
     * @throws Throwable
     */
    public function store(UserFormRequest $request)
    {
        $user = $this->creationService->handle($request->normalize());
        $this->alert->success($this->translator->get('admin/user.notices.account_created'))->flash();

        return redirect()->route('admin.users.view', $user->id);
    }

    /**
     * Update a user on the system.
     *
     * @return RedirectResponse
     *
     * @throws DataValidationException
     * @throws RecordNotFoundException
     */
    public function update(UserFormRequest $request, User $user)
    {
        $this->updateService
            ->setUserLevel(User::USER_LEVEL_ADMIN)
            ->handle($user, $request->normalize());

        $this->alert->success(trans('admin/user.notices.account_updated'))->flash();

        return redirect()->route('admin.users.view', $user->id);
    }

    /**
     * Update a users resources.
     *
     * @param UserResourceFormRequest $request
     * @param User $user
     * @return RedirectResponse
     * @throws Throwable
     */
    public function updateResources(UserResourceFormRequest $request, User $user): RedirectResponse
    {
        $this->updateService->setUserLevel(User::USER_LEVEL_ADMIN)->handle($user, $request->normalize());
        $this->alert->success(trans('admin/user.notices.account_updated'))->flash();
        return redirect()->route('admin.users.store', $user->id);
    }

    /**
     * Get a JSON response of users on the system.
     *
     * @return Collection|Model
     */
    public function json(Request $request)
    {
        $users = QueryBuilder::for(User::query())->allowedFilters(['email'])->paginate(25);

        // Handle single user requests.
        if ($request->query('user_id')) {
            $user = User::query()->findOrFail($request->input('user_id'));
            $user->md5 = md5(strtolower($user->email));

            return $user;
        }

        return $users->map(function ($item) {
            $item->md5 = md5(strtolower($item->email));

            return $item;
        });
    }
}
