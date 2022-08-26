<script lang="typescript">
    import { Icon, Text, Tooltip, PingingBadge } from 'shared/components'
    import { SidebarTab, dashboardRoute } from '@core/router'
    import { localize } from '@core/i18n'

    export let tab: SidebarTab = undefined

    let tooltipAnchor
    let showTooltip = false

    const handleClick = (): void => {
        _showTooltip(false)
        tab?.onClick()
    }

    const _showTooltip = (show: boolean): void => {
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
        <Text type="p">{localize(`tabs.${tab?.label}`)}</Text>
    </Tooltip>
{/if}
