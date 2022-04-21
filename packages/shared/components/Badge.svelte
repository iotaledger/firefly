<script lang="typescript">
    import { Icon, Text, Tooltip } from 'shared/components'

    let tooltipAnchor
    export let network = ''

    const commonClasses =
        'absolute right-0 bottom-0 h-7 w-7 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-900'
</script>

<div class="grid">
    {#if network === 'IOTA Mainnet' || network === 'IOTA Devnet'}
        <div bind:this={tooltipAnchor} class="bg-black {commonClasses}">
            <Icon icon="iota" classes="text-white" />
        </div>
        <Tooltip anchor={tooltipAnchor} position="right">
            <Text type="p">{network}</Text>
        </Tooltip>
    {:else if network === 'Shimmer Mainnet' || network === 'Shimmer Devnet'}
        <div bind:this={tooltipAnchor} class="bg-shimmer-highlight {commonClasses}">
            <Icon icon="shimmer" classes="text-black" />
        </div>
        <Tooltip anchor={tooltipAnchor} position="right">
            <Text type="p">{network}</Text>
        </Tooltip>
    {/if}
</div>
