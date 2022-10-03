<script lang="typescript">
    import { onMount } from 'svelte'
    import { OnboardingLayout } from '../../../../../components'
    import { OnboardingButton } from 'shared/components'
    import features from '@features/features'
    import { cleanupOnboarding, onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { NetworkProtocol, NetworkType } from '@core/network'
    import { networkSetupRouter } from '@core/router'
    import { resetActiveProfile } from '@core/profile'

    const title = localize('views.onboarding.networkSetup.chooseProtocol.title')

    function onProtocolSelectionClick(networkProtocol: NetworkProtocol): void {
        if ($onboardingProfile?.isDeveloperProfile) {
            updateOnboardingProfile({ networkProtocol })
        } else {
            updateOnboardingProfile({ networkProtocol, networkType: NetworkType.Mainnet })
        }
        $networkSetupRouter.next()
    }

    async function onBackClick(): Promise<void> {
        await cleanupOnboarding(true)
        $networkSetupRouter.previous()
    }

    onMount(() => {
        resetActiveProfile()
        updateOnboardingProfile({ networkProtocol: null })
    })
</script>

<OnboardingLayout {onBackClick} {title} animation="onboarding-protocol-desktop">
    <div slot="footer" class="flex flex-col space-y-4">
        {#each Object.keys(NetworkProtocol) as protocol}
            <OnboardingButton
                primaryText={protocol}
                secondaryText={localize(`views.onboarding.networkSetup.chooseProtocol.${NetworkProtocol[protocol]}`)}
                icon={NetworkProtocol[protocol]}
                iconColor={`${NetworkProtocol[protocol]}-highlight`}
                hidden={$onboardingProfile?.isDeveloperProfile
                    ? features?.onboarding?.[NetworkProtocol[protocol]]?.hidden
                    : features?.onboarding?.[NetworkProtocol[protocol]]?.hidden ||
                      features?.onboarding?.[NetworkProtocol[protocol]]?.[NetworkType.Mainnet]?.hidden}
                onClick={() => onProtocolSelectionClick(NetworkProtocol[protocol])}
            />
        {/each}
    </div>
</OnboardingLayout>
