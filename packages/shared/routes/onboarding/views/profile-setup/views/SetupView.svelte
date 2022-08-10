<script lang="typescript">
    import { onMount } from 'svelte'
    import { Animation, OnboardingButton, Link, Logo, OnboardingLayout, Text } from 'shared/components'
    import features from '@features/features'
    import { onboardingProfile, ProfileSetupType, updateOnboardingProfile } from '@contexts/onboarding'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { formatProtocolName, NetworkProtocol } from '@core/network'
    import { destroyProfileManager } from '@core/profile-manager'
    import { profileSetupRouter } from '@core/router'
    import { Platform } from '@lib/platform'

    function onProfileSetupSelectionClick(setupType: ProfileSetupType): void {
        updateOnboardingProfile({ setupType })
        $profileSetupRouter.next()
    }

    function onBackClick(): void {
        $profileSetupRouter.previous()
    }

    onMount(() => {
        destroyProfileManager()
        updateOnboardingProfile({ mustVisitProfileName: true, setupType: null, hasInitialisedProfileManager: false })
    })
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type="h2"
            >{localize('views.setup.title', {
                values: { protocol: formatProtocolName($onboardingProfile?.networkProtocol) },
            })}</Text
        >
    </div>
    <div slot="leftpane__content" class:hidden={$onboardingProfile?.networkProtocol !== NetworkProtocol.IOTA}>
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
            hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.claimRewards?.hidden}
            disabled={!features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.claimRewards?.enabled}
            onClick={() => onProfileSetupSelectionClick(ProfileSetupType.Claimed)}
        />
        <OnboardingButton
            primaryText={localize('actions.createWallet', {
                values: { protocol: formatProtocolName($onboardingProfile?.networkProtocol) },
            })}
            secondaryText={!$mobile
                ? localize('actions.createWalletDescription', {
                      values: { protocol: $onboardingProfile?.networkProtocol },
                  })
                : ''}
            icon="plus"
            iconHeight="11"
            iconWidth="11"
            hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.newProfile?.hidden}
            disabled={!features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.newProfile?.enabled}
            onClick={() => onProfileSetupSelectionClick(ProfileSetupType.New)}
        />
        <OnboardingButton
            primaryText={localize(`actions.restoreWallet.${$onboardingProfile?.networkProtocol}`)}
            secondaryText={!$mobile
                ? localize(`actions.restoreWalletDescription.${$onboardingProfile?.networkProtocol}`)
                : ''}
            icon="transfer"
            hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.restoreProfile?.hidden}
            disabled={!features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.restoreProfile?.enabled}
            onClick={() => onProfileSetupSelectionClick(ProfileSetupType.Recovered)}
        />
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-yellow dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="setup-desktop" />
    </div>
</OnboardingLayout>
