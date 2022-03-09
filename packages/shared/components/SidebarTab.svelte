<script lang="typescript">
    import { Icon, Text, Tooltip } from 'shared/components'
    import { dashboardRoute } from 'shared/lib/router'
    import type { SidebarTab } from 'shared/lib/typings/routes'

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
        <span class="absolute -top-2 -left-2 flex justify-center items-center h-3 w-3">
            <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full {tab?.notificationType === 'warning'
                    ? 'bg-yellow-400'
                    : 'bg-red-300'} opacity-75"
            />
            <span
                class="relative inline-flex rounded-full h-2 w-2 {tab?.notificationType === 'warning'
                    ? 'bg-yellow-600'
                    : 'bg-red-500'}"
            />
        </span>
    {/if}
</button>
{#if showTooltip}
    <Tooltip anchor={tooltipAnchor} position="right">
        <Text type="p">{tab?.label}</Text>
    </Tooltip>
{/if}
