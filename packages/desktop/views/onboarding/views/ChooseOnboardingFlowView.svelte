<script lang="ts">
    import { OnboardingLayout } from '@components'
    import { OnboardingType, onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { getNetworkNameFromNetworkId } from '@core/network'
    import { profiles } from '@core/profile'
    import features from '@features/features'
    import { Animation, OnboardingButton, Text } from '@ui'
    import { onMount } from 'svelte'
    import { onboardingRouter } from '@core/router'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { AnimationEnum } from '@auxiliary/animation'

    const networkId = $onboardingProfile?.network?.id

    function onProfileSetupSelectionClick(onboardingType: OnboardingType): void {
        updateOnboardingProfile({ onboardingType })
        $onboardingRouter.next()
    }

    function onBackClick(): void {
        $onboardingRouter.previous()
    }

    onMount(() => {
        // Clean up if user has navigated back to this view
        updateOnboardingProfile({ onboardingType: undefined })
    })
</script>

<OnboardingLayout allowBack={$profiles.length > 0 || $onboardingProfile?.isDeveloperProfile} {onBackClick}>
    <div slot="title">
        <Text type="h2"
            >{localize('views.onboarding.profileSetup.setup.title', {
                values: {
                    network: getNetworkNameFromNetworkId(networkId),
                },
            })}</Text
        >
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8"
            >{localize('views.onboarding.profileSetup.setup.body', {
                values: {
                    network: getNetworkNameFromNetworkId(networkId),
                },
            })}</Text
        >
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        <OnboardingButton
            primaryText={localize('actions.createWallet', {
                values: {
                    network: getNetworkNameFromNetworkId(networkId),
                },
            })}
            secondaryText={localize('actions.createWalletDescription', {
                values: { network: networkId },
            })}
            icon={IconEnum.Plus}
            iconHeight="11"
            iconWidth="11"
            hidden={features?.onboarding?.[networkId]?.newProfile?.hidden}
            disabled={!features?.onboarding?.[networkId]?.newProfile?.enabled}
            onClick={() => onProfileSetupSelectionClick(OnboardingType.Create)}
        />
        <OnboardingButton
            primaryText={localize(`actions.restoreWallet.${networkId}`)}
            secondaryText={localize(`actions.restoreWalletDescription.${networkId}`)}
            icon={IconEnum.Transfer}
            hidden={features?.onboarding?.[networkId]?.restoreProfile?.hidden}
            disabled={!features?.onboarding?.[networkId]?.restoreProfile?.enabled}
            onClick={() => onProfileSetupSelectionClick(OnboardingType.Restore)}
        />
        <OnboardingButton
            primaryText={localize('actions.claimShimmer')}
            secondaryText={localize('actions.claimShimmerDescription')}
            icon={IconEnum.Tokens}
            iconHeight="24"
            iconWidth="24"
            hidden={features?.onboarding?.[networkId]?.claimRewards?.hidden}
            disabled={!features?.onboarding?.[networkId]?.claimRewards?.enabled}
            onClick={() => onProfileSetupSelectionClick(OnboardingType.Claim)}
        />
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-green dark:bg-gray-900">
        <Animation animation={AnimationEnum.SetupDesktop} />
    </div>
</OnboardingLayout>
