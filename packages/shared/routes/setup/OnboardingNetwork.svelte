<script lang="typescript">
    import { localize } from '@core/i18n'
    import { appRouter } from '@core/router'
    import { Button, OnboardingLayout, Text } from 'shared/components'
    import { newProfile } from '@core/profile'
    import { mobile } from '@lib/app'
    import { INetwork, NETWORK, NetworkProtocol, NetworkType, updateNewProfileNetwork } from '@core/network'
    import { TextType } from 'shared/components/Text.svelte'

    const isPrivateNet = (network: INetwork) => network.type === NetworkType.PrivateNet

    const networks: INetwork[] = Object.values(NETWORK).flatMap(Object.values)
    const filteredNetworks = $newProfile?.isDeveloperProfile
        ? [...networks.filter((network) => !isPrivateNet(network)), networks.find(isPrivateNet)] // gets only one private net in array
        : networks.filter((network) => network.type === NetworkType.Mainnet)

    function getNetworkColor(network: INetwork) {
        if (isPrivateNet(network)) {
            return 'gray-500'
        }
        return network.protocol === NetworkProtocol.Shimmer ? 'shimmer-highlight' : 'black'
    }
    function getNetworkIcon(network: INetwork) {
        return isPrivateNet(network) ? 'settings' : network.protocol
    }
    function getNetworkText(network: INetwork) {
        if (isPrivateNet(network)) {
            return localize('views.network.privatenet')
        }
        return localize(`views.network.${network.protocol}.${network.type}`)
    }
    function onClick(network: INetwork): void {
        updateNewProfileNetwork(network.protocol, network.type)
        $appRouter.next()
    }
    function onBackClick(): void {
        $appRouter.previous()
    }
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type={TextType.h2}>{localize('views.network.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text secondary classes="mb-8">{localize('views.network.body')}</Text>
        <ul>
            {#each filteredNetworks as network}
                <li>
                    <Button
                        icon={getNetworkIcon(network)}
                        iconColor={getNetworkColor(network)}
                        classes="w-full mb-5"
                        secondary
                        onClick={() => onClick(network)}
                    >
                        {network.name}
                        {#if !$mobile}
                            <Text secondary smaller>{getNetworkText(network)}</Text>
                        {/if}
                    </Button>
                </li>
            {/each}
        </ul>
    </div>
</OnboardingLayout>
