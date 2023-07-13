<script lang="ts">
    import { Icon, Text, Spinner, Position, InformationTooltip } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { MenuItemVariant } from './enums'

    export let icon: IconEnum | undefined = undefined
    export let iconProps: Record<string, unknown> | undefined = undefined
    export let title: string
    export let subtitle: string = ''
    export let onClick: () => void
    export let selected: boolean = false
    export let disabled: boolean = false
    export let isLoading: boolean = false
    export let enableTooltipVisible: boolean = false
    export let tooltip: string | undefined = undefined
    export let variant: MenuItemVariant = MenuItemVariant.Info

    enum Color {
        Blue = 'blue',
        Green = 'green',
        Yellow = 'yellow',
        Red = 'red',
    }

    let showTooltip = false
    let menuItem: HTMLElement
    let color = Color.Blue

    $: isDisabled = disabled || isLoading
    $: color = colorMap[variant]

    const colorMap: Record<MenuItemVariant, Color> = {
        [MenuItemVariant.Info]: Color.Blue,
        [MenuItemVariant.Success]: Color.Green,
        [MenuItemVariant.Warning]: Color.Yellow,
        [MenuItemVariant.Error]: Color.Red,
    }

    function onMenuItemClick(): void {
        if (!disabled && onClick) {
            return onClick()
        }
    }

    function toggleTooltip(show: boolean): void {
        showTooltip = enableTooltipVisible && show
    }

    function handleMouseEnter(): void {
        toggleTooltip(true)
    }

    function handleMouseLeave(): void {
        toggleTooltip(false)
    }
</script>

<button
    bind:this={menuItem}
    on:click|stopPropagation={onMenuItemClick}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    class:disabled={isDisabled}
    class="group w-full flex flex-row justify-between items-center p-3 hover:bg-{color}-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20"
>
    <div class="flex flex-row space-x-3 items-center">
        {#if isLoading}
            <Spinner busy width={24} height={24} />
        {:else}
            <Icon
                {icon}
                height={24}
                width={24}
                classes={isDisabled
                    ? 'text-gray-400 dark:text-gray-700'
                    : `text-gray-600 group-hover:text-${color}-500`}
                {...iconProps}
            />
        {/if}
        <div class="flex flex-col text-left">
            <Text
                color={isDisabled ? 'gray-400' : 'gray-800'}
                darkColor={isDisabled ? 'gray-700' : 'white'}
                classes={isDisabled ? '' : `group-hover:text-${color}-500`}
            >
                {title}
            </Text>
            {#if subtitle}
                <Text color={isDisabled ? 'gray-400' : 'gray-600'} darkColor={isDisabled ? 'gray-700' : 'gray-500'}>
                    {subtitle}
                </Text>
            {/if}
        </div>
    </div>
    {#if selected}
        <Icon icon={IconEnum.Checkmark} classes="ml-2 text-blue-500" />
    {/if}
</button>

{#if showTooltip}
    <InformationTooltip anchor={menuItem} position={Position.Right} body={tooltip} />
{/if}

<style lang="scss">
    button {
        &.disabled {
            @apply bg-gray-100;
            @apply dark:bg-gray-850;
            @apply cursor-default;
        }
    }
</style>
