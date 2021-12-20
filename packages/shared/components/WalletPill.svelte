<script lang="typescript">
    import { Text, Tooltip } from 'shared/components'
    import { getInitials } from 'shared/lib/helpers'
    import { localize } from 'shared/lib/i18n'

    export let name: string = ''
    export let color: string = 'blue'
    export let size: 's' | 'm' = 'm'
    export let active: boolean = false
    export let onClick: () => void = () => {}
    export let enableTooltip = false
    export let tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top'
    export let classes: string = ''

    let showTooltip = false
    let tooltipAnchor

    const toggleTooltip = (): void => {
        showTooltip = !showTooltip
    }
</script>

<button
    on:click={onClick}
    on:mouseenter={toggleTooltip}
    on:mouseleave={toggleTooltip}
    bind:this={tooltipAnchor}
    class="{size === 'm' ? 'w-10 h-10 rounded-xl p-2 text-14' : 'w-8 h-8 rounded-lg p-1 text-12'} leading-100 font-bold text-center
            {active ? `bg-${color}-500 text-white` : 'bg-gray-200 dark:bg-gray-700 text-gray-500'} 
            hover:bg-{color}-500 hover:text-white {classes}">{getInitials(name, 2)}
</button>

{#if enableTooltip && showTooltip}
    <Tooltip anchor={tooltipAnchor} position={tooltipPosition}>
        <Text type="p" classes="text-gray-900 bold text-center">
            {localize('general.stakingName', { values: { name } })}
        </Text>
    </Tooltip>
{/if}
