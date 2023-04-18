<script lang="ts">
    import { Button } from '@ui'
    import { NetworkConfigRoute, networkConfigRouter } from '@desktop/routers'
    import { NetworkCard } from './components'
    import { activeProfile } from '@core/profile'
    import { selectedAccount } from '@core/account'
    import { NetworkHealth } from '@core/network'
    import { Icon } from '@auxiliary/icon'

    type ConnectedChain = { name: string; address: string; status: NetworkHealth }

    let connectedChains: ConnectedChain[] = []

    $: setConnectedChains()
    function setConnectedChains(): void {
        const chains = []

        const mainChain = {
            name: $activeProfile.network.name,
            address: $selectedAccount.depositAddress,
            status: NetworkHealth.Operational,
        }
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
    <Button outline icon={Icon.Plus} iconHeight={12} onClick={onAddChainClick} classes="mt-4">Add chain</Button>
</connected-chains-drawer>
