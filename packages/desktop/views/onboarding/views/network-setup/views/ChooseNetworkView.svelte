<script lang="ts">
    import { Icon } from '@auxiliary/icon'
    import { OnboardingLayout } from '@components'
    import {
        initialiseOnboardingProfile,
        shouldBeDeveloperProfile,
        updateOnboardingProfile,
        onboardingProfile,
    } from '@contexts/onboarding'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { NetworkId, getDefaultClientOptions, getDefaultPersistedNetwork } from '@core/network'
    import { profiles } from '@core/profile'
    import features from '@features/features'
    import { Animation, OnboardingButton, Text, TextType } from '@ui'
    import { onMount } from 'svelte'
    import { networkSetupRouter } from '../network-setup-router'
    import { AnimationEnum } from '@auxiliary/animation'

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
        // Clean up if user has navigated back to this view
        updateOnboardingProfile({ network: undefined, clientOptions: undefined })
        // If coming from this view with no profiles, initialise a new profile
        if (!$onboardingProfile?.id) {
            await initialiseOnboardingProfile(shouldBeDeveloperProfile())
        }
    })
</script>

<OnboardingLayout allowBack={$profiles.length > 0} {onBackClick}>
    <div slot="title">
        <Text type={TextType.h2}>{localize('views.onboarding.networkSetup.chooseNetwork.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text secondary classes="mb-8">{localize('views.onboarding.networkSetup.chooseNetwork.body')}</Text>
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        {#each Object.values(NetworkId) as networkId}
            <OnboardingButton
                primaryText={localize(`views.onboarding.networkSetup.chooseNetwork.${networkId}.title`)}
                secondaryText={!$mobile
                    ? localize(`views.onboarding.networkSetup.chooseNetwork.${networkId}.body`)
                    : ''}
                icon={networkIcon[networkId]}
                iconColor={getIconColor(networkId)}
                hidden={features?.onboarding?.[networkId]?.hidden}
                disabled={!features?.onboarding?.[networkId]?.enabled}
                onClick={() => onNetworkSelectionClick(networkId)}
            />
        {/each}
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-yellow dark:bg-gray-900'}">
        <Animation animation={AnimationEnum.OnboardingNetworkDesktop} />
    </div>
</OnboardingLayout>
