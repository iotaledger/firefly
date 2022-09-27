<script lang="typescript">
    import { onMount } from 'svelte'
    import { Animation, OnboardingButton, OnboardingLayout, Text } from 'shared/components'
    import features from '@features/features'
    import { onboardingProfile, ProfileSetupType, updateOnboardingProfile } from '@contexts/onboarding'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { formatProtocolName, getDefaultClientOptions } from '@core/network'
    import { destroyProfileManager } from '@core/profile-manager'
    import { profileSetupRouter } from '@core/router'

    function onProfileSetupSelectionClick(setupType: ProfileSetupType): void {
        updateOnboardingProfile({ setupType })
        $profileSetupRouter.next()
    }

    function onBackClick(): void {
        updateOnboardingProfile({ clientOptions: undefined })
        $profileSetupRouter.previous()
    }

    onMount(() => {
        if (!$onboardingProfile?.clientOptions) {
            const clientOptions = getDefaultClientOptions(
                $onboardingProfile?.networkProtocol,
                $onboardingProfile?.networkType
            )
            updateOnboardingProfile({ clientOptions })
        }
        destroyProfileManager()
        updateOnboardingProfile({ mustVisitProfileName: true, setupType: null, hasInitialisedProfileManager: false })
    })
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type="h2"
            >{localize('views.onboarding.profileSetup.setup.title', {
                values: { protocol: formatProtocolName($onboardingProfile?.networkProtocol) },
            })}</Text
        >
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8"
            >{localize('views.onboarding.profileSetup.setup.body', {
                values: { protocol: formatProtocolName($onboardingProfile?.networkProtocol) },
            })}</Text
        >
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
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-green dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="setup-desktop" />
    </div>
</OnboardingLayout>
