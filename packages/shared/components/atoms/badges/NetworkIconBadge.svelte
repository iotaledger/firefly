<script lang="ts">
    import { FontWeight, NetworkIcon, Text, Tooltip } from 'shared/components'
    import { Position } from 'shared/components/enums'
    import { NETWORK_INFO_MAP, NetworkProtocol, NetworkType } from '@core/network'

    export let networkProtocol: NetworkProtocol
    export let networkType: NetworkType

    let tooltipAnchor: HTMLElement
    let isTooltipVisible = false

    $: tooltipText = NETWORK_INFO_MAP?.[networkProtocol]?.[networkType]?.name

    function showTooltip(show: boolean): void {
        isTooltipVisible = show
    }
</script>

{#if networkType && networkProtocol}
    <network-icon-badge
        bind:this={tooltipAnchor}
        on:mouseenter={() => showTooltip(true)}
        on:mouseleave={() => showTooltip(false)}
        on:wheel={() => showTooltip(false)}
        class="block absolute -right-1 -bottom-1"
    >
        <NetworkIcon {networkProtocol} />
    </network-icon-badge>
    {#if isTooltipVisible}
        <Tooltip anchor={tooltipAnchor} size="small" position={Position.Right} offset={6}>
            <Text fontWeight={FontWeight.semibold} color="gray-600" darkColor="gray-400" smaller>
                {tooltipText}
            </Text>
        </Tooltip>
    {/if}
{/if}
