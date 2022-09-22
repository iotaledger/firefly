<script lang="typescript">
    import { Icon, Text, Tooltip } from 'shared/components'

    export let title: string
    export let text: string
    export let icon: string = 'info'
    export let width: number = 16
    export let height: number = 16
    export let classes: string = ''

    let tooltipAnchor
    let showTooltip = false

    function _showTooltip(show: boolean): void {
        showTooltip = show
    }
</script>

<div
    on:mouseenter={() => _showTooltip(true)}
    on:mouseleave={() => _showTooltip(false)}
    bind:this={tooltipAnchor}
    class="text-gray-600 {classes}"
>
    <Icon {width} {height} {icon} />
</div>
{#if showTooltip}
    <Tooltip anchor={tooltipAnchor} position="right">
        <Text type="h5" classes="text-left mb-2">{title}</Text>
        <Text classes="text-left">{text}</Text>
    </Tooltip>
{/if}
