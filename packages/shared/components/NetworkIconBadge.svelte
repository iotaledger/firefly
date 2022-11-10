<script lang="typescript">
    import { NETWORK, NetworkProtocol, NetworkType } from '@core/network'
    import { NetworkIcon, Text, Tooltip, FontWeight } from 'shared/components'

    export let networkType: NetworkType
    export let networkProtocol: NetworkProtocol

    let tooltipAnchor
    let showTooltip = false

    $: tooltipText = NETWORK?.[networkProtocol]?.[networkType]?.name

    function _showTooltip(show: boolean): void {
        showTooltip = show
    }
</script>

{#if networkType && networkProtocol}
    <div
        on:mouseenter={() => _showTooltip(true)}
        on:mouseleave={() => _showTooltip(false)}
        on:mousewheel={() => _showTooltip(false)}
        bind:this={tooltipAnchor}
        class="absolute -right-1 -bottom-1"
    >
        <NetworkIcon {networkProtocol} />
    </div>
    {#if showTooltip}
        <Tooltip anchor={tooltipAnchor} size="small" position="right" offset={6}>
            <Text type="p" fontWeight={FontWeight.semibold} color="gray-600" darkColor="gray-400" smaller>
                {tooltipText}
            </Text>
        </Tooltip>
    {/if}
{/if}
