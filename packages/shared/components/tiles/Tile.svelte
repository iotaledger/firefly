<script lang="ts">
    import { appSettings } from '@core/app'

    export let isGhost = false
    export let fullWidth = true
    export let selected = false
    export let classes = ''

    $: darkmode = $appSettings.darkMode
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
    class:darkmode
    on:click
    {...$$restProps}
>
    <slot />
</tile>

<style lang="scss">
    .selected {
        @apply outline outline-1 outline-gray-400 bg-blue-50;

        &.darkmode {
            @apply outline-blue-500 bg-blue-100;
            @apply bg-blue-300 bg-opacity-10;
        }
    }
</style>
