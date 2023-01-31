<script lang="ts">
    export let isGhost = false
    export let classes = ''
</script>

<tile
    class="
        flex w-full p-4 rounded-10
        {isGhost
        ? 'bg-transparent border border-solid border-gray-200 dark:border-gray-700'
        : 'bg-gray-50 dark:bg-gray-900'}
        {classes}
    "
    on:click
    {...$$restProps}
>
    <slot />
</tile>
