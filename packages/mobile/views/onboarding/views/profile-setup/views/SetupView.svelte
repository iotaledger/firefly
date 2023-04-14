<script lang="ts">
    import { onMount } from 'svelte'

    import { OnboardingLayout } from '@components'
    import { OnboardingButton } from '@ui'

    import { showAppNotification } from '@auxiliary/notification'
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
    import features from '@features/features'

    const SETUP_TYPES = Object.values(ProfileSetupType)
    const title = localize('views.onboarding.profileSetup.setup.title', {
        values: { protocol: formatProtocolName($onboardingProfile?.networkProtocol) },
    })

    let isBusy = SETUP_TYPES.reduce((obj, type) => ({ ...obj, [type]: false }), {})
    let isDisabled = SETUP_TYPES.reduce((obj, type) => ({ ...obj, [type]: false }), {})

    async function onProfileSetupSelectionClick(setupType: ProfileSetupType): Promise<void> {
        isBusy = { ...isBusy, ...SETUP_TYPES.reduce((obj, type) => ({ ...obj, [type]: type === setupType }), {}) }
        isDisabled = {
            ...isDisabled,
            ...SETUP_TYPES.reduce((obj, type) => ({ ...obj, [type]: type !== setupType }), {}),
        }
        try {
            // We dont support Ledger profiles on mobile yet, so we hardcode the type to Software
            updateOnboardingProfile({ setupType, type: ProfileType.Software })
            await initialiseProfileManagerFromOnboardingProfile()
            $profileSetupRouter.next()
        } catch (error) {
            showAppNotification({
                type: 'error',
                message: localize(error),
            })
        } finally {
            isBusy = SETUP_TYPES.reduce((obj, type) => ({ ...obj, [type]: false }), {})
            isDisabled = SETUP_TYPES.reduce((obj, type) => ({ ...obj, [type]: false }), {})
        }
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
            busy={isBusy[ProfileSetupType.Claimed]}
            hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.claimRewards?.hidden}
            disabled={isDisabled[ProfileSetupType.Claimed] ||
                !features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
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
            busy={isBusy[ProfileSetupType.New]}
            hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.newProfile?.hidden}
            disabled={isDisabled[ProfileSetupType.New] ||
                !features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                    ?.newProfile?.enabled}
            onClick={() => onProfileSetupSelectionClick(ProfileSetupType.New)}
        />
        <OnboardingButton
            primaryText={localize(`actions.restoreWallet.${$onboardingProfile?.networkProtocol}`)}
            icon="transfer"
            busy={isBusy[ProfileSetupType.Recovered]}
            hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.restoreProfile?.hidden}
            disabled={isDisabled[ProfileSetupType.Recovered] ||
                !features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                    ?.restoreProfile?.enabled}
            onClick={() => onProfileSetupSelectionClick(ProfileSetupType.Recovered)}
        />
    </div>
</OnboardingLayout>
