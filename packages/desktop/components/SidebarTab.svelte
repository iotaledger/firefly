<script lang="ts">
    import { Icon, PingingBadge, Position, InformationTooltip } from '@ui'
    import { dashboardRoute } from '@core/router'
    import { ISidebarTab } from '@desktop/routers'

    export let tab: ISidebarTab = undefined

    let tooltipAnchor: HTMLButtonElement
    let showTooltip = false

    function onClick(): void {
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
    on:click={onClick}
>
    <Icon width="24" height="24" icon={tab?.icon} />
    {#if tab?.notificationType}
        <PingingBadge
            innerColor={tab?.notificationType === 'warning' ? 'yellow-600' : 'red-500'}
            outerColor={tab?.notificationType === 'warning' ? 'yellow-400' : 'red-300'}
            classes="absolute -top-2 -left-2"
        />
    {/if}
</button>

{#if showTooltip}
    <InformationTooltip anchor={tooltipAnchor} position={Position.Right} size="small" body={tab?.label} />
{/if}
