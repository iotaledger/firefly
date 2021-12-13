<script lang="typescript">
    import { appSettings } from 'shared/lib/appSettings'
    import { onMount } from 'svelte'

    export let classes = ''
    export let parentLeft = 0
    export let parentTop = 0
    export let parentWidth = 0
    export let position: undefined | 'top' | 'bottom' | 'right' = undefined

    let tooltip
    let top = 0
    let left = 0

    let darkModeEnabled
    $: darkModeEnabled = $appSettings.darkMode

    $: parentLeft, parentTop, parentWidth, refreshPosition()

    onMount(refreshPosition)

    // TODO: refactor all this component to use anchor prop instead of parent
    // and move all the logic here to position and display the tooltip
    function refreshPosition() {
        if (!tooltip) {
            return
        }
        if (position === 'top' || !position) {
            top = parentTop - tooltip.offsetHeight - 15
            left = parentLeft - tooltip.offsetWidth / 2 + parentWidth
        } else if (position === 'right') {
            top = parentTop < tooltip.offsetHeight ? parentTop - 10 : parentTop - tooltip.offsetHeight / 2 - 15
            left = parentLeft + parentWidth * 2 + 15
        } else if (position === 'bottom') {
            top = parentTop + 50
            left = parentLeft - tooltip.offsetWidth / 2 + parentWidth
        }
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
        &.right {
            box-shadow: 0 20px 25px 7px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            @apply w-60;
            triangle,
            inner-dark {
                border-width: 12px;
                @apply border-b-0;
                left: -18px;
                @apply top-6;
                @apply transform;
                @apply rotate-90;
            }
            &.darkmode {
                triangle {
                    @apply border-gray-700;
                    @apply border-l-transparent;
                    @apply border-r-transparent;
                    inner-dark {
                        @apply block;
                        left: -12px;
                        transform: none;
                        top: -14px;
                    }
                }
            }
        }
        &.bottom {
            box-shadow: 0 20px 25px 7px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            @apply w-60;
            triangle,
            inner-dark {
                border-width: 12px;
                top: -12px;
                @apply border-b-0;
                @apply transform;
                @apply -translate-x-1/2;
                @apply left-1/2;
            }
            triangle {
                @apply rotate-180;
                top: -12px;
            }
            inner-dark {
                top: -13px;
            }
            &.darkmode {
                triangle {
                    @apply border-gray-700;
                    @apply border-l-transparent;
                    @apply border-r-transparent;
                }
            }
        }
    }
</style>

<tooltip
    class="fixed text-center z-10 py-4 px-4 w-auto max-w-60 shadow-lg rounded-xl border border-solid bg-white dark:bg-gray-900 border-white dark:border-gray-700 {position} {classes}"
    class:darkmode={darkModeEnabled}
    style="top: {top}px; left:{left}px;"
    bind:this={tooltip}>
    <slot />
    <triangle>
        <inner-dark class="border-gray-700" />
    </triangle>
</tooltip>
