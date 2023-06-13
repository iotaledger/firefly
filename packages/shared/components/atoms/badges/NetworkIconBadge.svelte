<script lang="ts">
    import { IPersistedNetwork } from '@core/network'
    import { FontWeight, NetworkIcon, Text, Tooltip } from 'shared/components'
    import { Position } from 'shared/components/enums'

    export let network: IPersistedNetwork
    export let chainId: string
    export let width: number
    export let height: number

    let tooltipAnchor: HTMLElement
    let isTooltipVisible = false

    $: tooltipText = network?.name

    function showTooltip(show: boolean): void {
        isTooltipVisible = show
    }
</script>

{#if network}
    <network-icon-badge
        bind:this={tooltipAnchor}
        on:mouseenter={() => showTooltip(true)}
        on:mouseleave={() => showTooltip(false)}
        on:wheel={() => showTooltip(false)}
        class="block absolute -right-1 -bottom-1"
    >
        <NetworkIcon {width} {height} networkId={network.id} {chainId} />
    </network-icon-badge>
    {#if isTooltipVisible}
        <Tooltip anchor={tooltipAnchor} size="small" position={Position.Right} offset={6}>
            <Text fontWeight={FontWeight.semibold} color="gray-600" darkColor="gray-400" smaller>
                {tooltipText}
            </Text>
        </Tooltip>
    {/if}
{/if}
