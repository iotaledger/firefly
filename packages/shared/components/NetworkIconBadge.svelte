<script lang="typescript">
    import { NetworkIcon, Text, Tooltip } from 'shared/components'

    let tooltipAnchor
    let showTooltip = false

    export let network = ''
    export let protocol = ''

    const _showTooltip = (show: boolean): void => {
        showTooltip = show
    }
</script>

{#if network && protocol}
    <div on:mouseenter={() => _showTooltip(true)} on:mouseleave={() => _showTooltip(false)} bind:this={tooltipAnchor}>
        <NetworkIcon {protocol} />
    </div>
    {#if showTooltip}
        <Tooltip anchor={tooltipAnchor} size="small" position="right">
            <Text type="p">{network}</Text>
        </Tooltip>
    {/if}
{/if}
