<script lang="ts">
    import { NetworkId } from '@core/network'
    import { NetworkIcon, InformationTooltip } from '@ui'
    import { Position } from '@ui/enums'

    export let networkId: NetworkId
    export let tooltipText: string = ''
    export let width: number | undefined = undefined
    export let height: number | undefined = undefined

    let tooltipAnchor: HTMLElement
    let isTooltipVisible = false

    function showTooltip(show: boolean): void {
        isTooltipVisible = show
    }
</script>

<network-icon-badge
    bind:this={tooltipAnchor}
    on:mouseenter={() => showTooltip(true)}
    on:mouseleave={() => showTooltip(false)}
    on:wheel={() => showTooltip(false)}
    class="block absolute -right-1 -bottom-1"
>
    <NetworkIcon {width} {height} {networkId} />
</network-icon-badge>
{#if isTooltipVisible && tooltipText}
    <InformationTooltip anchor={tooltipAnchor} size="small" position={Position.Right} offset={6} body={tooltipText} />
{/if}
