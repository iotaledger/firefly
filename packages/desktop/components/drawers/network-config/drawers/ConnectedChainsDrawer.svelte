<script lang="ts">
    import { Icon } from '@ui'
    import { NetworkConfigRoute, networkConfigRouter } from '@desktop/routers'
    import { clearSelectedChain, network, networkStatus } from '@core/network'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { NetworkCard } from '@components'
    import { localize } from '@core/i18n'
    import networkFeatures from '@features/network.features'
    import { onMount } from 'svelte'

    function onAddChainClick(): void {
        $networkConfigRouter.goTo(NetworkConfigRoute.AddChain)
    }

    onMount(() => {
        clearSelectedChain()
    })
</script>

<connected-chains-drawer class="h-full flex flex-col justify-between">
    <div class="flex flex-col gap-4">
        {#key $networkStatus}
            <NetworkCard network={$network} />
            {#each $network.getChains() as chain}
                <NetworkCard {chain} />
            {/each}
        {/key}
    </div>
    {#if networkFeatures.config.addChain.enabled}
        <button
            type="button"
            class="flex flex-row items-center justify-center w-full space-x-2 bg-transparent text-blue-500 px-8 py-3 text-15 rounded-lg"
            on:click|stopPropagation={onAddChainClick}
        >
            <Icon icon={IconEnum.Plus} height={12} />
            {localize('views.dashboard.drawers.networkConfig.addChain.title')}
        </button>
    {/if}
</connected-chains-drawer>
