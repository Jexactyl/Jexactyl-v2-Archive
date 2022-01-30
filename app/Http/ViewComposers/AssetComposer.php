<?php

namespace Pterodactyl\Http\ViewComposers;

use Illuminate\View\View;
use Pterodactyl\Contracts\Repository\CreditsRepositoryInterface;
use Pterodactyl\Services\Helpers\AssetHashService;
use Pterodactyl\Contracts\Repository\SettingsRepositoryInterface;

class AssetComposer
{
    /**
     * @var \Pterodactyl\Services\Helpers\AssetHashService
     */
    private $assetHashService;

    private SettingsRepositoryInterface $settings;
    private CreditsRepositoryInterface $credits;

    /**
     * AssetComposer constructor.
     */
    public function __construct(AssetHashService $assetHashService, SettingsRepositoryInterface $settings, CreditsRepositoryInterface $credits)
    {
        $this->credits = $credits;
        $this->assetHashService = $assetHashService;
        $this->settings = $settings;
    }

    /**
     * Provide access to the asset service in the views.
     */
    public function compose(View $view)
    {
        $view->with('asset', $this->assetHashService);
        $view->with('siteConfiguration', [
            'name' => config('app.name') ?? 'Pterodactyl',
            'locale' => config('app.locale') ?? 'en',
            'recaptcha' => [
                'enabled' => config('recaptcha.enabled', false),
                'siteKey' => config('recaptcha.website_key') ?? '',
            ],
            'analytics' => config('app.analytics') ?? '',
            'userRegistration' => $this->settings->get('settings::app:user_registration'),
            'usernameEdit' => $this->settings->get('settings::app:username_edit'),
            'particles' => $this->settings->get('settings::app:particles'),
            'rainbowBar' => $this->settings->get('settings::app:rainbow_bar'),
            'store' => [
                'enabled' => $this->credits->get('store:enabled', 0),
            ],
        ]);
    }
}
