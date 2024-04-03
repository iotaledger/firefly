<script lang="ts">
    import { Icon, PingingBadge, Position, InformationTooltip } from '@ui'
    import { dashboardRoute } from '@core/router'
    import { ISidebarTab } from '@desktop/routers'
    import { addToVisitedTabs, visitedTabsStore } from '@contexts/dashboard/stores'

    export let tab: ISidebarTab = undefined

    let anchor: HTMLButtonElement
    let showTooltip: boolean = false

    function onClick(): void {
        handleHideTooltip()
        tab?.onClick()
        addToVisitedTabs(tab?.route)
    }

    function handleHideTooltip(): void {
        showTooltip = false
    }

    function handleShowTooltip(): void {
        showTooltip = true
    }
</script>

<button
    on:mouseenter={handleShowTooltip}
    on:mouseleave={handleHideTooltip}
    bind:this={anchor}
    class="{$dashboardRoute === tab?.route ? 'text-blue-500' : 'text-gray-500'} relative disabled:opacity-50"
    on:click={onClick}
    disabled={tab?.disabled}
>
    <Icon width="24" height="24" icon={tab?.icon} />

    {#if tab?.notificationType}
        <PingingBadge
            innerColor={tab?.notificationType === 'warning' ? 'yellow-600' : 'red-500'}
            outerColor={tab?.notificationType === 'warning' ? 'yellow-400' : 'red-300'}
            classes="absolute -top-2 -left-2"
        />
    {/if}

    {#if tab?.showNotificationBadge || !$visitedTabsStore.includes(tab?.route)}
        <PingingBadge innerColor="red-500" outerColor="red-300" classes="absolute -top-2 -left-2" />
    {/if}
</button>

{#if showTooltip}
    <InformationTooltip {anchor} position={Position.Right} size="small" body={tab?.label} />
{/if}
