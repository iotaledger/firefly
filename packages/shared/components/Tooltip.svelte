<script lang="typescript">
    import { appSettings } from 'shared/lib/appSettings'
    import { onMount } from 'svelte'
    export let classes = ''
    export let parentLeft = 0
    export let parentTop = 0
    export let parentWidth = 0

    let tooltip
    let top = 0
    let left = 0

    $: darkModeEnabled = $appSettings.darkMode

    $: parentLeft, parentTop, parentWidth, refreshPosition()

    onMount(refreshPosition)

    function refreshPosition() {
        if (!tooltip) {
            return
        }
        top = parentTop - tooltip.offsetHeight - 15
        left = parentLeft - tooltip.offsetWidth / 2 + parentWidth
    }
</script>

<style type="text/scss">
    tooltip {
        triangle,
        inner-dark {
            @apply h-0;
            @apply w-0;
            @apply absolute;
            @apply border-solid;
            @apply border-8;
            @apply border-b-0;
            @apply border-white;
            @apply border-l-transparent;
            @apply border-r-transparent;
            @apply transform;
            @apply -translate-x-1/2;
            @apply -bottom-2;
            @apply left-1/2;
            inner-dark {
                bottom: 1px;
                @apply hidden;
                @apply border-gray-900;
                @apply border-l-transparent;
                @apply border-r-transparent;
            }
        }
        &.darkmode {
            triangle {
                @apply border-gray-700;
                @apply border-l-transparent;
                @apply border-r-transparent;
                inner-dark {
                    @apply block;
                }
            }
        }
    }
</style>

<tooltip
    class="fixed text-center z-10 py-4 px-6 w-auto max-w-60 shadow-lg rounded-xl border border-solid bg-white dark:bg-gray-900 border-white dark:border-gray-700 {classes}"
    class:darkmode={darkModeEnabled}
    style="top: {top}px; left:{left}px;"
    bind:this={tooltip}>
    <slot />
    <triangle>
        <inner-dark class="border-gray-700" />
    </triangle>
</tooltip>
