<script lang="ts">
    export let isGhost = false
    export let fullWidth = true
    export let selected = false
    export let classes = ''
</script>

<tile
    class="
        flex p-4 rounded-10
        {fullWidth ? 'w-full' : ''}
        {isGhost
        ? 'bg-transparent border border-solid border-gray-200 dark:border-gray-700'
        : 'bg-gray-50 dark:bg-gray-900'}
        {classes}
    "
    class:selected
    on:click
    {...$$restProps}
>
    <slot />
</tile>

<style lang="scss">
    .selected {
        @apply border border-solid border-blue-500 bg-blue-100;
        @apply dark:bg-blue-300 dark:bg-opacity-10;
    }
</style>
