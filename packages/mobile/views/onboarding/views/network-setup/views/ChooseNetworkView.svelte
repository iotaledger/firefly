<script lang="ts">
    import { onMount } from 'svelte'

    import { OnboardingLayout } from '@components'
    import { OnboardingButton } from '@ui'

    import { Icon } from '@auxiliary/icon'
    import {
        initialiseOnboardingProfile,
        onboardingProfile,
        shouldBeDeveloperProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { NetworkId, getDefaultClientOptions, getDefaultPersistedNetwork } from '@core/network'

    import { networkSetupRouter } from '@/routers'
    import features from '@features/features'

    const title = localize('views.onboarding.networkSetup.chooseNetwork.title')

    let networkIcon: { [key in NetworkId]: string }

    $: networkIcon = {
        [NetworkId.Iota]: Icon.Iota,
        [NetworkId.Shimmer]: Icon.Shimmer,
        [NetworkId.Testnet]: 'settings',
        [NetworkId.Custom]: 'settings',
    }

    function getIconColor(networkId: NetworkId): string {
        switch (networkId) {
            case NetworkId.Iota:
                return 'iota-highlight'
            case NetworkId.Shimmer:
                return 'shimmer-highlight'
            case NetworkId.Testnet:
                return 'blue-500'
            case NetworkId.Custom:
                return 'blue-500'
        }
    }

    function onNetworkSelectionClick(networkId: NetworkId): void {
        if (networkId !== NetworkId.Custom) {
            const network = getDefaultPersistedNetwork(networkId)
            const clientOptions = getDefaultClientOptions(networkId)
            updateOnboardingProfile({ network, clientOptions })
        }
        $networkSetupRouter.next()
    }

    function onBackClick(): void {
        $networkSetupRouter.previous()
    }

    onMount(async () => {
        if (!$onboardingProfile?.id) {
            await initialiseOnboardingProfile($onboardingProfile?.isDeveloperProfile ?? shouldBeDeveloperProfile())
        }
        updateOnboardingProfile({ network: undefined })
    })
</script>

<OnboardingLayout {onBackClick} {title} animation="onboarding-network-desktop">
    <div slot="footer" class="flex flex-col space-y-4">
        {#each Object.values(NetworkId) as networkId}
            <OnboardingButton
                primaryText={localize(`views.onboarding.networkSetup.chooseNetwork.${networkId}.title`)}
                secondaryText={localize(`views.onboarding.networkSetup.chooseNetwork.${networkId}.body`)}
                icon={networkIcon[networkId]}
                iconColor={getIconColor(networkId)}
                hidden={features?.onboarding?.[networkId]?.hidden}
                disabled={!features?.onboarding?.[networkId]?.enabled}
                onClick={() => onNetworkSelectionClick(networkId)}
            />
        {/each}
    </div>
</OnboardingLayout>
