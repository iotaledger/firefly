<script lang="typescript">
    import Box from 'shared/components/atoms/boxes/Box.svelte'

    export let isFocused = false
    export let error = ''
    export let classes = ''
    export let clearBackground = false
    export let clearPadding = false
    export let clearBorder = false
</script>

<Box
    {clearBackground}
    {clearPadding}
    backgroundColor="white"
    darkBackgroundColor="gray-800"
    classes="w-full flex 
        {!clearPadding ? 'p-4' : ''}
        {!clearBorder ? 'border border-solid' : ''}
        {classes}
        {isFocused
        ? 'border-blue-500'
        : error
        ? 'border-red-300 hover:border-red-500'
        : 'border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 focus:border-blue-500 dark:focus:border-gray-600'}"
    {...$$restProps}
>
    <slot />
</Box>
