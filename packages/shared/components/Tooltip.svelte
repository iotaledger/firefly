<script lang="typescript" context="module">
    export enum Position {
        Top = 'top',
        Bottom = 'bottom',
        Left = 'left',
        Right = 'right',
    }
</script>

<script lang="typescript">
    import { appSettings } from '@core/app'
    import { onMount } from 'svelte'

    export let classes = ''
    export let anchor: HTMLElement | null = null
    export let position: Position = Position.Top
    export let refresh: boolean = false // prop used to refresh the tooltip position
    export let offset: number = 10
    export let inlineStyle: string = ''
    export let size: 'small' | 'medium' | undefined = 'medium'
    export let backgroundColor = 'white'
    export let darkBackgroundColor = 'gray-900'
    export let borderColor = 'white'
    export let darkBorderColor = 'gray-700'

    let tooltip: HTMLElement
    let top = 0
    let left = 0
    const anchorBox: {
        top: number
        left: number
        width: number
        height: number
    } = {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    }

    $: darkModeEnabled = $appSettings.darkMode
    $: refresh, refreshPosition()

    onMount(refreshPosition)

    function refreshAnchorBox(): void {
        anchorBox.top = anchor?.getBoundingClientRect()?.top ?? 0
        anchorBox.left = anchor?.getBoundingClientRect()?.left ?? 0
        anchorBox.width = anchor?.offsetWidth ?? 0
        anchorBox.height = anchor?.offsetHeight ?? 0
    }

    export function refreshPosition(): void {
        if (!tooltip) {
            return
        }
        refreshAnchorBox()
        switch (position) {
            case Position.Top:
                top = anchorBox.top - tooltip.offsetHeight - offset
                left = anchorBox.left - tooltip.offsetWidth / 2 + anchorBox.width / 2
                break
            case Position.Bottom:
                top = anchorBox.top + anchorBox.height + offset
                left = anchorBox.left - tooltip.offsetWidth / 2 + anchorBox.width / 2
                break
            case Position.Left:
                top = anchorBox.top - tooltip.offsetHeight / 2 + anchorBox.height / 2
                left = anchorBox.left - tooltip.offsetWidth - offset
                break
            case Position.Right:
                top = anchorBox.top - tooltip.offsetHeight / 2 + anchorBox.height / 2
                left = anchorBox.left + anchorBox.width + offset
                break
        }
    }
</script>

<tooltip
    class="{size} shadow-elevation-4 fixed text-center z-10 whitespace-pre-line
    {size === 'small' ? 'px-2 py-1 rounded-md' : 'p-4 rounded-xl'}
    w-auto max-w-60 shadow-lg border border-solid bg-{backgroundColor} dark:bg-{darkBackgroundColor} border-{borderColor} dark:border-{darkBorderColor} {position} {classes}"
    class:darkmode={darkModeEnabled}
    style="top: {top}px; left:{left}px; {inlineStyle}"
    bind:this={tooltip}
>
    <slot />
    <triangle class="border-{borderColor} dark:border-{darkBorderColor}">
        <inner-triangle class="border-gray-700" />
    </triangle>
</tooltip>

<style type="text/scss">
    tooltip {
        max-width: 300px;
        triangle,
        inner-triangle {
            @apply h-0;
            @apply w-0;
            @apply border-solid;
            @apply border-8;
            @apply border-b-0;
            @apply border-l-transparent;
            @apply border-r-transparent;
        }
        triangle {
            @apply absolute;
            @apply transform;
            @apply -translate-x-1/2;
            @apply left-1/2;
        }
        inner-triangle {
            @apply hidden;
            @apply relative;
            @apply border-gray-900;
            @apply border-l-transparent;
            @apply border-r-transparent;
        }
        &.darkmode {
            triangle {
                @apply border-gray-700;
                @apply border-l-transparent;
                @apply border-r-transparent;
                inner-triangle {
                    @apply block;
                }
            }
        }
        &.top {
            triangle {
                bottom: -8px;
            }
            inner-triangle {
                bottom: 9px;
                left: -8px;
            }
        }
        &.bottom {
            triangle {
                @apply -rotate-180;
                top: -8px;
            }
            inner-triangle {
                top: -9px;
                left: -8px;
            }
        }
        &.right,
        &.left {
            triangle,
            inner-triangle {
                @apply border-b-0;
            }
            triangle {
                @apply top-1/2;
                @apply -translate-y-1/2;
                @apply rotate-90;
            }
            &.darkmode {
                triangle {
                    @apply border-gray-700;
                    @apply border-l-transparent;
                    @apply border-r-transparent;
                    inner-triangle {
                        bottom: 9px;
                        right: 8px;
                    }
                }
            }
        }
        &.right {
            triangle {
                left: -5px;
            }
        }
        &.left {
            triangle {
                left: unset;
                right: -20px;
                @apply -rotate-90;
            }
        }
        &.small {
            triangle,
            inner-triangle {
                @apply border-4;
                @apply border-b-0;
            }
            &.top {
                triangle {
                    bottom: -4px;
                }
                inner-triangle {
                    bottom: 5px;
                    left: -4px;
                }
            }
            &.bottom {
                triangle {
                    top: -4px;
                }
                inner-triangle {
                    top: -5px;
                    left: -4px;
                }
            }
            &.right,
            &.left {
                &.darkmode {
                    triangle {
                        inner-triangle {
                            bottom: 5px;
                            right: 4px;
                        }
                    }
                }
            }
            &.right {
                triangle {
                    left: -3px;
                }
            }
            &.left {
                triangle {
                    right: -11px;
                }
            }
        }
    }
</style>
