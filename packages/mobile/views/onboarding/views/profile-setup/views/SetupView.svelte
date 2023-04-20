<script lang="ts">
    import { onMount } from 'svelte'

    import { OnboardingLayout } from '@components'
    import { OnboardingButton } from '@ui'

    import {
        initialiseOnboardingProfile,
        initialiseProfileManagerFromOnboardingProfile,
        onboardingProfile,
        ProfileSetupType,
        shouldBeDeveloperProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { getNetworkNameFromNetworkId, getDefaultClientOptions } from '@core/network'
    import { ProfileType } from '@core/profile'
    import { destroyProfileManager } from '@core/profile-manager'

    import { profileSetupRouter } from '@/routers'
    import features from '@features/features'

    const networkId = $onboardingProfile?.network?.id
    const title = localize('views.onboarding.profileSetup.setup.title', {
        values: { protocol: getNetworkNameFromNetworkId(networkId) },
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
            await initialiseOnboardingProfile($onboardingProfile?.isDeveloperProfile ?? shouldBeDeveloperProfile())
            updateOnboardingProfile({ network: undefined })
        }
        if (!$onboardingProfile?.clientOptions) {
            const clientOptions = getDefaultClientOptions(networkId)
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
            hidden={features?.onboarding?.[networkId]?.claimRewards?.hidden}
            disabled={!features?.onboarding?.[networkId]?.claimRewards?.enabled}
            onClick={() => onProfileSetupSelectionClick(ProfileSetupType.Claimed)}
        />
        <OnboardingButton
            primaryText={localize('actions.createWallet', {
                values: {
                    protocol: getNetworkNameFromNetworkId(networkId),
                },
            })}
            icon="plus"
            iconHeight="11"
            iconWidth="11"
            hidden={features?.onboarding?.[networkId]?.newProfile?.hidden}
            disabled={!features?.onboarding?.[networkId]?.newProfile?.enabled}
            onClick={() => onProfileSetupSelectionClick(ProfileSetupType.New)}
        />
        <OnboardingButton
            primaryText={localize(`actions.restoreWallet.${networkId}`)}
            icon="transfer"
            hidden={features?.onboarding?.[networkId]?.restoreProfile?.hidden}
            disabled={!features?.onboarding?.[networkId]?.restoreProfile?.enabled}
            onClick={() => onProfileSetupSelectionClick(ProfileSetupType.Recovered)}
        />
    </div>
</OnboardingLayout>
