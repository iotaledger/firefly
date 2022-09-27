<script lang="typescript">
    import { Icon, Text, Tooltip } from 'shared/components'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'
    import { Position } from 'shared/components/Tooltip.svelte'

    export let title: string
    export let text: string
    export let icon: IconEnum = IconEnum.Info
    export let width: number = 16
    export let height: number = 16
    export let classes: string = ''
    export let position: Position = Position.Right

    let tooltipAnchor: HTMLElement
    let isTooltipVisible = false

    function showTooltip(show: boolean): void {
        isTooltipVisible = show
    }
</script>

<tooltip-icon class="flex items-center">
    <icon-container
        on:mouseenter={() => showTooltip(true)}
        on:mouseleave={() => showTooltip(false)}
        bind:this={tooltipAnchor}
        class="text-gray-600 {classes}"
    >
        <Icon {width} {height} {icon} />
    </icon-container>
    {#if isTooltipVisible}
        <Tooltip anchor={tooltipAnchor} {position}>
            <Text type="h5" classes="text-left mb-2">{title}</Text>
            <Text classes="text-left">{text}</Text>
        </Tooltip>
    {/if}
</tooltip-icon>
