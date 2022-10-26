<script lang="typescript">
    import {
        initialiseOnboardingProfile,
        onboardingProfile,
        shouldBeDeveloperProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { getDefaultClientOptions, NetworkProtocol, NetworkType } from '@core/network'
    import { networkSetupRouter } from '../../../../../lib/routers'
    import features from '../../../../../features/features'
    import { OnboardingButton } from 'shared/components'
    import { onMount } from 'svelte'
    import { OnboardingLayout } from '../../../../../components'

    const title = localize('views.onboarding.networkSetup.chooseNetwork.title')

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

<OnboardingLayout {onBackClick} {title} animation="onboarding-network-desktop">
    <div slot="footer" class="flex flex-col space-y-4">
        {#each Object.values(NetworkType) as networkType}
            <OnboardingButton
                primaryText={localize(
                    `views.onboarding.networkSetup.chooseNetwork.${networkProtocol}.${networkType}.title`
                )}
                secondaryText={localize(
                    `views.onboarding.networkSetup.chooseNetwork.${networkProtocol}.${networkType}.body`
                )}
                icon={networkIcon[networkType]}
                iconColor={networkType === NetworkType.Mainnet ? `${networkProtocol}-highlight` : 'blue-500'}
                hidden={features?.onboarding?.[networkProtocol]?.[networkType]?.hidden}
                disabled={!features?.onboarding?.[networkProtocol]?.[networkType]?.enabled}
                onClick={() => onNetworkSelectionClick(networkType)}
            />
        {/each}
    </div>
</OnboardingLayout>
