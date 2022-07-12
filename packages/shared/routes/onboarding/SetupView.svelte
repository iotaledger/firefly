<script lang="typescript">
    import { Animation, OnboardingButton, Link, Logo, OnboardingLayout, Text } from 'shared/components'
    import features from 'shared/features/features'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { formatProtocolName, NetworkProtocol } from '@core/network'
    import { newProfile } from '@contexts/onboarding'
    import { appRouter } from '@core/router'
    import { Platform } from '@lib/platform'
    import { SetupType } from '@lib/typings/setup'

    function handleContinueClick(setupType: SetupType): void {
        $appRouter.next({ setupType })
    }

    function handleBackClick(): void {
        $appRouter.previous()
    }
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2"
            >{localize('views.setup.title', {
                values: { protocol: formatProtocolName($newProfile?.networkProtocol) },
            })}</Text
        >
    </div>
    <div slot="leftpane__content" class:hidden={$newProfile?.networkProtocol !== NetworkProtocol.IOTA}>
        <div class="relative flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-16 p-8 pt-16">
            <div class="absolute -top-14">
                <Logo width="auto" height="auto" logo="logo-chrysalis-gem" />
            </div>
            <Text type="h3" classes="mb-6 text-center">{localize('views.setup.chrysalisTitle')}</Text>
            <Text type="p" secondary classes="mb-8">{localize('views.setup.chrysalisBody')}</Text>
            <Link onClick={() => Platform.openUrl('https://blog.iota.org/firefly-token-migration/')}>
                {localize('views.setup.learnMore')}
            </Link>
        </div>
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        <OnboardingButton
            primaryText={localize('actions.claimShimmer')}
            secondaryText={!$mobile ? localize('actions.claimShimmerDescription') : ''}
            icon="tokens"
            iconHeight="24"
            iconWidth="24"
            hidden={features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.claimRewards
                ?.hidden}
            disabled={!features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.claimRewards
                ?.enabled}
            onClick={() => {}}
        />
        <OnboardingButton
            primaryText={localize('actions.createWallet', {
                values: { protocol: formatProtocolName($newProfile?.networkProtocol) },
            })}
            secondaryText={!$mobile
                ? localize('actions.createWalletDescription', {
                      values: { protocol: $newProfile?.networkProtocol },
                  })
                : ''}
            icon="plus"
            iconHeight="11"
            iconWidth="11"
            hidden={features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.newProfile
                ?.hidden}
            disabled={!features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.newProfile
                ?.enabled}
            onClick={() => handleContinueClick(SetupType.New)}
        />
        <OnboardingButton
            primaryText={localize(`actions.restoreWallet.${$newProfile?.networkProtocol}`)}
            secondaryText={!$mobile ? localize(`actions.restoreWalletDescription.${$newProfile?.networkProtocol}`) : ''}
            icon="transfer"
            hidden={features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.restoreProfile
                ?.hidden}
            disabled={!features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.restoreProfile
                ?.enabled}
            onClick={() => handleContinueClick(SetupType.Import)}
        />
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-yellow dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="setup-desktop" />
    </div>
</OnboardingLayout>
