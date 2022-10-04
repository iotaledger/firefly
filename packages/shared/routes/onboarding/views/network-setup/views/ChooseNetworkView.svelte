<script lang="typescript">
    import { onMount } from 'svelte'
    import { Animation, OnboardingButton, OnboardingLayout, Text, TextType } from 'shared/components'
    import features from '@features/features'
    import {
        initialiseOnboardingProfile,
        onboardingProfile,
        shouldBeDeveloperProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { getDefaultClientOptions, NetworkProtocol, NetworkType } from '@core/network'
    import { networkSetupRouter } from '@core/router'
    import { profiles } from '@core/profile'

    $: networkProtocol = $onboardingProfile?.networkProtocol ?? NetworkProtocol.Shimmer

    let networkIcon: { [key in NetworkType]: string }
    $: networkIcon = {
        [NetworkType.Mainnet]: networkProtocol,
        [NetworkType.Devnet]: 'settings',
        [NetworkType.PrivateNet]: 'settings',
    }

    function onNetworkSelectionClick(networkType: NetworkType): void {
        if (networkType !== NetworkType.PrivateNet) {
            const clientOptions = getDefaultClientOptions($onboardingProfile?.networkProtocol, networkType)
            updateOnboardingProfile({ clientOptions })
        }
        updateOnboardingProfile({ networkType })
        $networkSetupRouter.next()
    }

    function onBackClick(): void {
        $networkSetupRouter.previous()
    }

    onMount(() => {
        if (!$onboardingProfile?.id) {
            initialiseOnboardingProfile(
                $onboardingProfile?.isDeveloperProfile ?? shouldBeDeveloperProfile(),
                NetworkProtocol.Shimmer
            )
        }
        updateOnboardingProfile({ networkType: null })
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
        {#each Object.values(NetworkType) as networkType}
            <OnboardingButton
                primaryText={localize(
                    `views.onboarding.networkSetup.chooseNetwork.${networkProtocol}.${networkType}.title`
                )}
                secondaryText={!$mobile
                    ? localize(`views.onboarding.networkSetup.chooseNetwork.${networkProtocol}.${networkType}.body`)
                    : ''}
                icon={networkIcon[networkType]}
                iconColor={networkType === NetworkType.Mainnet ? `${networkProtocol}-highlight` : 'blue-500'}
                hidden={features?.onboarding?.[networkProtocol]?.[networkType]?.hidden}
                disabled={!features?.onboarding?.[networkProtocol]?.[networkType]?.enabled}
                onClick={() => onNetworkSelectionClick(networkType)}
            />
        {/each}
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-yellow dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="onboarding-network-desktop" />
    </div>
</OnboardingLayout>
