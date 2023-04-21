<script lang="ts">
    import { Icon } from '@ui'
    import { NetworkConfigRoute, networkConfigRouter } from '@desktop/routers'
    import { activeProfile } from '@core/profile'
    import { NetworkHealth, ConnectedChain, buildChainFromNetwork } from '@core/network'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { NetworkCard } from '@components'
    import { localize } from '@core/i18n'

    let connectedChains: ConnectedChain[] = []

    $: setConnectedChains()
    function setConnectedChains(): void {
        const chains = []

        const mainChain = buildChainFromNetwork()
        chains.push(mainChain)

        for (const chain of $activeProfile.network.chains) {
            chains.push({
                name: chain.name,
                address: chain.name, // TODO
                status: NetworkHealth.Operational, // TODO
            })
        }

        connectedChains = chains
    }

    function onAddChainClick(): void {
        $networkConfigRouter.goTo(NetworkConfigRoute.AddChain)
    }
</script>

<connected-chains-drawer class="h-full flex flex-col justify-between">
    <div class="flex flex-col gap-4">
        {#each connectedChains as chain}
            <NetworkCard {...chain} />
        {/each}
    </div>
    <button
        type="button"
        class="mt-4 flex flex-row items-center justify-center w-full space-x-2 bg-transparent text-blue-500 px-8 py-3 text-15 rounded-lg"
        on:click|stopPropagation={onAddChainClick}
    >
        <Icon icon={IconEnum.Plus} height={12} />
        {localize('views.dashboard.drawers.networkConfig.addChain.title')}
    </button>
</connected-chains-drawer>
