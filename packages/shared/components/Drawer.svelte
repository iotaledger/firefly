<!--
	@component Drawer, slides in-out from the bottom or right and contains
	the route contents handling scroll.
	Spans the height or width of the screen, with everything behind it visible but dimmed.
	Uses a Svelte Action to generate custom syntetic slide, swipe and tap events.

	@prop {number} [dimLength] - Dim length in CSS pixels.
	@prop {boolean} [opened] - Opens drawer on load.
	@prop {boolean} [fromRight] - Slide from right side.
    @prop {boolean} [preventClose] - Prevent close the Drawer.
    @prop {string} [zIndex] - Main container Tailwind z-index. Ex. "z-40".

	@function {() => Promise<viod>} open - Opens drawer.
	@function {() => Promise<void>} close - Closes drawer.
-->
<script lang="typescript">
    import { appSettings } from '@core/app'
    import { createEventDispatcher, onMount } from 'svelte'
    import { quintOut } from 'svelte/easing'
    import { tweened } from 'svelte/motion'

    $: darkModeEnabled = $appSettings.darkMode

    export let dimLength = 160
    export let opened = false
    export let fromRight = false
    export let classes = ''
    export let fullScreen = false
    export let preventClose = false
    export let zIndex = 'z-30'

    const dispatch = createEventDispatcher()

    const viewportLength = fromRight ? window.innerWidth : window.innerHeight

    let isOpen = false

    const coords = tweened(
        {
            x: fromRight ? viewportLength : 0,
            y: fromRight ? 0 : viewportLength,
        },
        { duration: 350, easing: quintOut }
    )

    onMount(async () => {
        if (opened) {
            await open()
        }
    })

    function slidable(node: HTMLElement, use: boolean = true) {
        if (!use) return
        let x: number
        let y: number
        let init: number

        function handleTouchstart(event: TouchEvent): void {
            event.preventDefault()

            if (event.targetTouches.length === 1) {
                init = window.performance.now()
                x = event.touches[0].pageX
                y = event.touches[0].pageY
            }

            node.addEventListener('touchmove', handleTouchmove)
            node.addEventListener('touchend', handleTouchend)
        }

        function handleTouchmove(event: TouchEvent) {
            if (event.targetTouches.length === 1) {
                const sx = event.touches[0].pageX - x
                const sy = event.touches[0].pageY - y
                x = event.touches[0].pageX
                y = event.touches[0].pageY

                node.dispatchEvent(
                    new CustomEvent('slideMove', {
                        detail: { x, y, sx, sy },
                    })
                )
            }
        }

        function handleTouchend() {
            node.dispatchEvent(new CustomEvent('slideEnd'))

            const elapsed = window.performance.now()
            if (init >= elapsed - 300) {
                node.dispatchEvent(new CustomEvent('tap'))
            }

            node.removeEventListener('touchmove', handleTouchmove)
            node.removeEventListener('touchend', handleTouchend)
        }

        node.addEventListener('touchstart', handleTouchstart)

        return {
            destroy() {
                node.removeEventListener('touchstart', handleTouchstart)
            },
        }
    }

    async function handleSlideMove(event: CustomEvent): Promise<void> {
        await coords.update(
            ($coords) => ({
                x: $coords.x + event.detail.sx,
                y: $coords.y + event.detail.sy,
            }),
            { duration: 0 }
        )
    }

    async function handleSlideEnd() {
        const thresholdUnreached = fromRight
            ? (viewportLength - dimLength) / 2 > $coords.x
            : (viewportLength - dimLength) / 1.2 > $coords.y
        if (thresholdUnreached) {
            await open()
        } else {
            await close()
        }
    }

    export async function open(): Promise<void> {
        isOpen = true
        await coords.set(
            {
                x: fromRight ? dimLength : 0,
                y: fromRight ? 0 : dimLength,
            },
            { duration: 750, easing: quintOut }
        )
    }

    export async function close(): Promise<void> {
        await coords.set(
            {
                x: fromRight ? viewportLength : 0,
                y: fromRight ? 0 : viewportLength,
            },
            { duration: 350, easing: quintOut }
        )
        isOpen = false
        if (!preventClose) {
            dispatch('close')
        }
    }

    const getScale = (coord: number, scale: number): number => (viewportLength - coord) / scale

    $: dimOpacity = getScale(fromRight ? $coords.x : $coords.y, 1000)
    $: contentOpacity = getScale(fromRight ? $coords.x : $coords.y, 100)
</script>

<drawer class="absolute top-0 {zIndex}" class:invisible={!isOpen}>
    <slide-zone
        class="fixed h-screen w-screen"
        use:slidable={!preventClose}
        on:slideMove={handleSlideMove}
        on:slideEnd={handleSlideEnd}
        on:tap={close}
    >
        <div id="dim" class="h-screen" style="--opacity: {dimOpacity}" />
    </slide-zone>
    <main
        class="fixed overflow-y-auto w-screen h-screen bg-white dark:bg-gray-800 {classes}"
        class:darkmode={darkModeEnabled}
        class:fullScreen
        style="--y: {fromRight ? 0 : $coords.y}px;
			--x: {fromRight ? $coords.x : 0}px;
			--opacity: {contentOpacity};
			--height: {fromRight ? '100vh' : `${viewportLength - dimLength}px`};
			--width: {fromRight ? `${viewportLength - dimLength}px` : '100%'};
			--border-radius: {fromRight ? '0' : '24px 24px 0 0'};
			--display-indicator: {fromRight ? 'none' : 'block'}"
    >
        <slot />
    </main>
</drawer>

<style type="text/scss">
    main {
        will-change: transform;
        transform: translate(var(--x), var(--y));
        border-radius: var(--border-radius);
        height: var(--height);
        width: var(--width);
        opacity: var(--opacity);
        --bg-indicator-color: #d8e3f5;
        @apply from-white;
        &.darkmode {
            @apply from-gray-800;
            --bg-indicator-color: #405985;
        }
    }

    // Rounded rectangle slide indicator
    main:before {
        display: var(--display-indicator);
        content: '';
        position: absolute;
        width: 48px;
        height: 4px;
        left: calc(50% - 48px / 2 - 0.5px);
        top: 8px;
        border-radius: 8px;
        background: var(--bg-indicator-color);
    }

    // Scroll overlay gradient mask
    main:not(.fullScreen):after {
        content: '';
        position: fixed;
        top: var(--padding-top);
        height: 30px;
        width: 100%;
        border-radius: var(--border-radius);
        background: linear-gradient(to bottom, var(--tw-gradient-stops) 100%);
    }

    #dim {
        will-change: opacity;
        background-color: rgba(0, 0, 0, var(--opacity));
    }

    .invisible {
        display: none;
    }
</style>
