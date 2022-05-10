<script lang="typescript">
    import { localize } from '@core/i18n'
    import { appRouter } from '@core/router'
    import { Button, OnboardingLayout, Text } from 'shared/components'
    import { activeProfile, updateProfile } from '@lib/profile'
    import { mobile } from '@lib/app'
    import { INetwork, NETWORK, NetworkProtocol, NetworkType } from '@core/network'

    const networks: INetwork[] = Object.values(NETWORK).flatMap(Object.values)
    const filteredNetworks = $activeProfile?.isDeveloperProfile
        ? networks
        : networks.filter((network) => network.type === NetworkType.Mainnet)

    function getNetworkColor(networkProtocol: NetworkProtocol) {
        return networkProtocol === NetworkProtocol.Shimmer ? 'shimmer-highlight' : 'black'
    }
    function onClick(network: INetwork): void {
        updateProfile('networkProtocol', network.protocol)
        updateProfile('networkType', network.type)
        $appRouter.next()
    }
    function onBackClick(): void {
        $appRouter.previous()
    }
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type="h2">{localize('views.network.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8">{localize('views.network.body')}</Text>
        <ul class="max-h-96 overflow-y-scroll">
            {#each filteredNetworks as network}
                <li>
                    <Button
                        icon={network.protocol}
                        iconColor={getNetworkColor(network.protocol)}
                        classes="w-full mb-5"
                        secondary
                        onClick={() => onClick(network)}
                    >
                        {network.name}
                        {#if !$mobile}
                            <Text type="p" secondary smaller
                                >{localize(`views.network.${network.protocol}.${network.type}`)}</Text
                            >
                        {/if}
                    </Button>
                </li>
            {/each}
        </ul>
    </div>
</OnboardingLayout>
