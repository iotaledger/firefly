<script lang="ts">
    import { Icon, Text, Tooltip, FontWeight, TextType, Position } from 'shared/components'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'

    export let title: string = ''
    export let text: string = ''
    export let icon: IconEnum = IconEnum.Info
    export let width: number = 16
    export let height: number = 16
    export let classes: string = ''
    export let iconClasses: string = ''
    export let position: Position = Position.Right
    export let primaryColor: string = undefined
    export let secondaryColor: string = undefined

    let tooltipAnchor: HTMLElement
    let isTooltipVisible = false

    function showTooltip(show: boolean): void {
        isTooltipVisible = show
    }
</script>

<tooltip-icon class={classes}>
    <icon-container
        on:mouseenter={() => showTooltip(true)}
        on:mouseleave={() => showTooltip(false)}
        bind:this={tooltipAnchor}
        class="text-gray-600"
    >
        <Icon {width} {height} {icon} classes={iconClasses} {primaryColor} {secondaryColor} />
    </icon-container>
    {#if isTooltipVisible}
        <Tooltip anchor={tooltipAnchor} {position} {...$$restProps}>
            <div class="flex flex-col space-y-2">
                {#if title}
                    <Text bigger type={TextType.h5} fontWeight={FontWeight.medium} classes="text-left" color="gray-900">
                        {title}
                    </Text>
                {/if}
                {#if text}
                    <Text smaller classes="text-left" color="gray-700" lineHeight="leading-140">{text}</Text>
                {/if}
            </div>
            <slot />
        </Tooltip>
    {/if}
</tooltip-icon>
