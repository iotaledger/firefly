<script lang="typescript">
    import { onMount } from 'svelte'
    import { OnboardingLayout } from '../../../../../components'
    import { OnboardingButton } from 'shared/components'
    import features from '@features/features'
    import { onboardingProfile, ProfileSetupType, updateOnboardingProfile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { formatProtocolName, getDefaultClientOptions } from '@core/network'
    import { destroyProfileManager } from '@core/profile-manager'
    import { profileSetupRouter } from '@core/router'

    const title = localize('views.onboarding.profileSetup.setup.title', {
        values: { protocol: formatProtocolName($onboardingProfile?.networkProtocol) },
    })

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

<OnboardingLayout {onBackClick} {title} animation="setup-desktop">
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
