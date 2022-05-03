<script>
    import { Icon, Text } from 'shared/components'

    export let icon
    export let title
    export let subtitle = ''
    export let onClick
    export let first = false
    export let last = false
    export let selected = false
    export let disabled = false

    function handleOnClick() {
        if (!disabled && onClick) {
            return onClick()
        }
    }
</script>

<button
    on:click={handleOnClick}
    class="group w-full flex flex-row justify-between items-center px-3 py-1.5 {first ? 'pt-3' : ''} {last
        ? 'pb-3'
        : ''}
            {!disabled
        ? 'hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20'
        : 'bg-gray-100 dark:bg-gray-850 cursor-default'}
    "
>
    <div class="flex flex-row space-x-3 items-center">
        <Icon
            {icon}
            classes={!disabled ? ' text-gray-600 group-hover:text-blue-500' : 'text-gray-400 dark:text-gray-700'}
        />
        <div class="flex flex-col text-left">
            <Text
                type="p"
                color={!disabled ? 'gray-800' : 'gray-400'}
                darkColor={!disabled ? 'white' : 'gray-700'}
                classes={!disabled ? 'group-hover:text-blue-500' : ''}
            >
                {title}
            </Text>
            {#if subtitle}
                <Text
                    type="p"
                    color={!disabled ? 'gray-600' : 'gray-400'}
                    darkColor={!disabled ? 'gray-500' : 'gray-700'}
                >
                    {subtitle}
                </Text>
            {/if}
        </div>
    </div>
    {#if selected}
        <Icon icon="checkmark" classes="text-blue-500" />
    {/if}
</button>
