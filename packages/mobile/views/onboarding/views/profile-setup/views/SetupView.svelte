<script lang="ts">
    import {
        initialiseOnboardingProfile,
        initialiseProfileManagerFromOnboardingProfile,
        onboardingProfile,
        ProfileSetupType,
        shouldBeDeveloperProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { formatProtocolName, getDefaultClientOptions, NetworkProtocol, NetworkType } from '@core/network'
    import { ProfileType } from '@core/profile'
    import { destroyProfileManager } from '@core/profile-manager'
    import { profileSetupRouter } from '@/routers'
    import { OnboardingButton } from '@ui'
    import { onMount } from 'svelte'
    import { OnboardingLayout } from '@components'
    import features from '@features/features'

    const title = localize('views.onboarding.profileSetup.setup.title', {
        values: { protocol: formatProtocolName($onboardingProfile?.networkProtocol) },
    })

    async function onProfileSetupSelectionClick(setupType: ProfileSetupType): Promise<void> {
        // We dont support Ledger profiles on mobile yet, so we hardcode the type to Software
        updateOnboardingProfile({ setupType, type: ProfileType.Software })
        await initialiseProfileManagerFromOnboardingProfile()
        $profileSetupRouter.next()
    }

    function onBackClick(): void {
        updateOnboardingProfile({ clientOptions: undefined })
        $profileSetupRouter.previous()
    }

    onMount(async () => {
        await destroyProfileManager()
        if (!$onboardingProfile?.id) {
            await initialiseOnboardingProfile(
                $onboardingProfile?.isDeveloperProfile ?? shouldBeDeveloperProfile(),
                NetworkProtocol.Shimmer
            )
            updateOnboardingProfile({ networkType: NetworkType.Mainnet })
        }
        if (!$onboardingProfile?.clientOptions) {
            const clientOptions = getDefaultClientOptions(
                $onboardingProfile?.networkProtocol,
                $onboardingProfile?.networkType
            )
            updateOnboardingProfile({ clientOptions })
        }
        updateOnboardingProfile({
            mustVisitProfileName: true,
            setupType: null,
            hasInitialisedProfileManager: false,
            type: null,
        })
    })
</script>

<OnboardingLayout {onBackClick} {title} animation="setup-desktop">
    <div slot="footer" class="flex flex-col space-y-4">
        <OnboardingButton
            primaryText={localize('actions.claimShimmer')}
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
