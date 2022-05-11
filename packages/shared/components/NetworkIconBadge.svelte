<script lang="typescript">
    import { NetworkIcon, Text, Tooltip } from 'shared/components'
    import { localize } from '@core/i18n'
    import { NetworkProtocol, NetworkType } from '@core/network'

    let tooltipAnchor
    let showTooltip = false

    export let networkType: NetworkType
    export let networkProtocol: NetworkProtocol

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
            <Text type="p">{localize(`network.${networkProtocol}.${networkType}`)}</Text>
        </Tooltip>
    {/if}
{/if}
