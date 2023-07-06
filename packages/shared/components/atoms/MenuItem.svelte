<script lang="ts">
    import { Icon, Text, Spinner, Position, InformationTooltip } from 'shared/components'

    export let icon: string = ''
    export let iconProps: Record<string, unknown> = undefined
    export let title: string
    export let subtitle = ''
    export let onClick: () => any
    export let selected = false
    export let disabled = false
    export let isLoading = false
    export let enableTooltipVisible = false
    export let tooltip: string = undefined

    export let variant: 'success' | 'error' | 'warning' | 'info' = 'info'

    let showTooltip = false
    let menuItem: HTMLElement
    let color = 'blue'

    $: isDisabled = disabled || isLoading

    $: variant, setColor()
    function setColor(): void {
        switch (variant) {
            case 'info':
                color = 'blue'
                break
            case 'success':
                color = 'green'
                break
            case 'warning':
                color = 'yellow'
                break
            case 'error':
                color = 'red'
                break
        }
    }

    function onMenuItemClick(): () => void {
        if (!disabled && onClick) {
            return onClick()
        }
    }

    function toggleTooltip(show: boolean): void {
        showTooltip = enableTooltipVisible && show
    }
</script>

<button
    bind:this={menuItem}
    on:click|stopPropagation={onMenuItemClick}
    on:mouseenter={() => toggleTooltip(true)}
    on:mouseleave={() => toggleTooltip(false)}
    class="group w-full flex flex-row justify-between items-center p-3
        {isDisabled
        ? 'bg-gray-100 dark:bg-gray-850 cursor-default'
        : `hover:bg-${color}-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20`}
    "
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
                type="p"
                color={isDisabled ? 'gray-400' : 'gray-800'}
                darkColor={isDisabled ? 'gray-700' : 'white'}
                classes={isDisabled ? '' : `group-hover:text-${color}-500`}
            >
                {title}
            </Text>
            {#if subtitle}
                <Text
                    type="p"
                    color={isDisabled ? 'gray-400' : 'gray-600'}
                    darkColor={isDisabled ? 'gray-700' : 'gray-500'}
                >
                    {subtitle}
                </Text>
            {/if}
        </div>
    </div>
    {#if selected}
        <Icon icon="checkmark" classes="ml-2 text-blue-500" />
    {/if}
</button>

{#if showTooltip}
    <InformationTooltip anchor={menuItem} position={Position.Right} body={tooltip} />
{/if}
