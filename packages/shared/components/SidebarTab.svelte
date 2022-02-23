<script lang="typescript">
    import { Icon, Text, Tooltip } from 'shared/components'

    enum NotificationType {
        Warning = 'warning',
        Error = 'error',
    }
    export let active: boolean = false
    export let notificationType: NotificationType = undefined
    export let icon: string = undefined
    export let label: string = undefined
    export let onClick: () => void = () => {}

    let tooltipAnchor
    let showTooltip = false

    const handleClick = (): void => {
        _showTooltip(false)
        onClick()
    }

    const _showTooltip = (show: boolean): void => {
        showTooltip = show
    }
</script>

<button
    on:mouseenter={() => _showTooltip(true)}
    on:mouseleave={() => _showTooltip(false)}
    bind:this={tooltipAnchor}
    class="{active ? 'text-blue-500' : 'text-gray-500'} relative"
    on:click={handleClick}
>
    <Icon width="24" height="24" {icon} />
    {#if notificationType}
        <span class="absolute -top-2 -left-2 flex justify-center items-center h-3 w-3">
            <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full {notificationType ===
                NotificationType.Warning
                    ? 'bg-yellow-400'
                    : 'bg-red-300'} opacity-75"
            />
            <span
                class="relative inline-flex rounded-full h-2 w-2 {notificationType === NotificationType.Warning
                    ? 'bg-yellow-600'
                    : 'bg-red-500'}"
            />
        </span>
    {/if}
</button>
{#if showTooltip}
    <Tooltip anchor={tooltipAnchor} position="right">
        <Text type="p">{label}</Text>
    </Tooltip>
{/if}
