<script lang="typescript">
    import { NetworkIcon, Text, Tooltip } from 'shared/components'
    import { NETWORK, NetworkProtocol, NetworkType } from '@core/network'

    export let networkType: NetworkType
    export let networkProtocol: NetworkProtocol

    let tooltipAnchor
    let showTooltip = false

    $: tooltipText = NETWORK[networkProtocol]?.[networkType]?.name

    const _showTooltip = (show: boolean): void => {
        showTooltip = show
    }
</script>

{#if networkType && networkProtocol}
    <div
        on:mouseenter={() => _showTooltip(true)}
        on:mouseleave={() => _showTooltip(false)}
        bind:this={tooltipAnchor}
        class="absolute -right-1 -bottom-1"
    >
        <NetworkIcon {networkProtocol} />
    </div>
    {#if showTooltip}
        <Tooltip anchor={tooltipAnchor} size="small" position="right">
            <Text type="p">{tooltipText}</Text>
        </Tooltip>
    {/if}
{/if}
