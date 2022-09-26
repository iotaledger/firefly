<script lang="typescript">
    import { onMount } from 'svelte'
    import { OnboardingLayout } from '../../../../../components'
    import { Animation, OnboardingButton, Text } from 'shared/components'
    import features from '@features/features'
    import { onboardingProfile, ProfileSetupType, updateOnboardingProfile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { formatProtocolName } from '@core/network'
    import { destroyProfileManager } from '@core/profile-manager'
    import { profileSetupRouter } from '@core/router'

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
            >{localize('views.onboarding.profileSetup.setup.title', {
                values: { protocol: formatProtocolName($onboardingProfile?.networkProtocol) },
            })}</Text
        >
    </div>
    <div slot="illustration" class="w-full h-full flex justify-center">
        <Animation classes="setup-anim-aspect-ratio" animation="setup-desktop" />
    </div>
    <div slot="footer" class="flex flex-col space-y-4">
        <OnboardingButton
            primaryText={localize('actions.createWallet', {
                values: { protocol: formatProtocolName($onboardingProfile?.networkProtocol) },
            })}
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
            icon="transfer"
            hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.restoreProfile?.hidden}
            disabled={!features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.restoreProfile?.enabled}
            onClick={() => onProfileSetupSelectionClick(ProfileSetupType.Recovered)}
        />
    </div>
</OnboardingLayout>
