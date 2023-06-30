<script lang="ts">
    import { FontWeight, Text, Tooltip } from 'shared/components'
    import { Position } from 'shared/components/enums'

    export let tooltipText: string = ''
    export let withTooltip: boolean = true

    let tooltipAnchor: HTMLElement
    let isTooltipVisible = false

    function showTooltip(show: boolean): void {
        isTooltipVisible = show
    }

    function handleMouseEnter(): void {
        showTooltip(true)
    }

    function handleMouseLeave(): void {
        showTooltip(false)
    }
</script>

<badge
    bind:this={tooltipAnchor}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    class="block absolute -right-1 -bottom-1"
>
    <slot name="icon" />
</badge>

{#if isTooltipVisible && tooltipText && withTooltip}
    <Tooltip anchor={tooltipAnchor} size="small" position={Position.Right} offset={6}>
        <Text fontWeight={FontWeight.semibold} color="gray-600" darkColor="gray-400" smaller>
            {tooltipText}
        </Text>
    </Tooltip>
{/if}
