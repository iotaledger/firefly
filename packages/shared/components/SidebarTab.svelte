<script lang="typescript">
    import { Icon, Text, Tooltip, PingingBadge } from 'shared/components'
    import { SidebarTab, dashboardRoute } from '@core/router'

    export let tab: SidebarTab = undefined

    let tooltipAnchor: HTMLButtonElement
    let showTooltip = false

    function handleClick(): void {
        _showTooltip(false)
        tab?.onClick()
    }

    function _showTooltip(show: boolean): void {
        showTooltip = show
    }
</script>

<button
    on:mouseenter={() => _showTooltip(true)}
    on:mouseleave={() => _showTooltip(false)}
    bind:this={tooltipAnchor}
    class="{$dashboardRoute === tab?.route ? 'text-blue-500' : 'text-gray-500'} relative"
    on:click={handleClick}
>
    <Icon width="24" height="24" icon={tab?.icon} />
    {#if tab?.notificationType}
        <PingingBadge
            innerColor={tab?.notificationType === 'warning' ? 'yellow-600' : 'red-500'}
            outerColor={tab?.notificationType === 'warning' ? 'yellow-400' : 'red-300'}
        />
    {/if}
</button>
{#if showTooltip}
    <Tooltip anchor={tooltipAnchor} position="right" size="small">
        <Text type="p">{tab?.label}</Text>
    </Tooltip>
{/if}
