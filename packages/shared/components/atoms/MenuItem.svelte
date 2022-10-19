<script lang="typescript">
    import { Icon, Text } from 'shared/components'

    export let icon: string = ''
    export let iconProps: Record<string, unknown> = undefined
    export let title: string
    export let subtitle = ''
    export let onClick: () => any
    export let selected = false
    export let disabled = false
    export let variant: 'success' | 'error' | 'warning' | 'info' = 'info'
    let color = 'blue'

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

    function handleOnClick(): () => void {
        if (!disabled && onClick) {
            return onClick()
        }
    }
</script>

<button
    on:click|stopPropagation={handleOnClick}
    class="group w-full flex flex-row justify-between items-center p-3
        {disabled
        ? 'bg-gray-100 dark:bg-gray-850 cursor-default'
        : `hover:bg-${color}-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20`}
    "
>
    <div class="flex flex-row space-x-3 items-center">
        <Icon
            {icon}
            height={24}
            width={24}
            classes={disabled ? 'text-gray-400 dark:text-gray-700' : `text-gray-600 group-hover:text-${color}-500`}
            {...iconProps}
        />
        <div class="flex flex-col text-left">
            <Text
                type="p"
                color={disabled ? 'gray-400' : 'gray-800'}
                darkColor={disabled ? 'gray-700' : 'white'}
                classes={disabled ? '' : `group-hover:text-${color}-500`}
            >
                {title}
            </Text>
            {#if subtitle}
                <Text
                    type="p"
                    color={disabled ? 'gray-400' : 'gray-600'}
                    darkColor={disabled ? 'gray-700' : 'gray-500'}
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
