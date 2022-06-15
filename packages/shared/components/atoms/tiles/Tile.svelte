<script lang="typescript">
    export let hasBorder = false
    export let classes = ''
</script>

<tile
    class="
        w-full flex flex-row justify-between items-center
        p-4
        rounded-10
        bg-gray-50 dark:bg-gray-900
        {hasBorder ? 'border border-solid border-gray-300 dark:border-gray-700' : ''}
        {classes}
    "
    on:click
    {...$$restProps}
>
    <slot />
</tile>
