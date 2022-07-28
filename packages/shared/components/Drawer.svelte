<!--
	@component Drawer, slides in-out from the bottom or right and contains 
	the route contents handling scroll.
	Spans the height or width of the screen, with everything behind it visible but dimmed.
	Uses a Svelte Action to generate custom syntetic slide, swipe and tap events.
	
	@prop {boolean} [opened] - Opens drawer on load.
	@prop {boolean} [fromLeft] - Slide from left side.
    @prop {boolean} [preventClose] - Prevent close the Drawer.
    @prop {string} [zIndex] - Main container Tailwind z-index. Ex. "z-40".
	
	@function {() => Promise<viod>} open - Opens drawer.
	@function {() => Promise<void>} close - Closes drawer.
-->
<script context="module" lang="typescript">
    type Drawers = Set<{ close: () => Promise<void> }>
    const drawers: Drawers = new Set()

    export function closePreviousDrawer(): void {
        const last = [...drawers].pop()
        last?.close()
        drawers.delete(last)
    }

    export function closeDrawers(): void {
        drawers.forEach((d) => {
            void d.close()
            drawers.delete(d)
        })
    }
</script>

<script lang="typescript">
    import { appSettings } from 'shared/lib/appSettings'
    import { createEventDispatcher, onMount } from 'svelte'
    import { quintOut } from 'svelte/easing'
    import { tweened } from 'svelte/motion'
    import { slidable } from '@lib/actions'

    $: darkModeEnabled = $appSettings.darkMode

    export let opened = false
    export let fromLeft = false
    export let classes = ''
    export let backgroundBlur = false
    export let preventClose = false
    export let zIndex = 'z-30'

    let content: HTMLElement = undefined
    let isOpen = false
    let isVelocityReached = false
    let preventSlide = true

    const dispatch = createEventDispatcher()
    const viewportLength = fromLeft ? window.innerWidth : window.innerHeight
    const coords = tweened(
        {
            x: fromLeft ? -viewportLength : 0,
            y: fromLeft ? 0 : viewportLength,
        },
        { duration: 350, easing: quintOut }
    )

    onMount(async () => {
        if (opened) {
            await open()
        }
        const currentDrawer = { close }
        drawers.add(currentDrawer)
    })

    async function handleSlideMove(event: CustomEvent): Promise<void> {
        // Calc slide gesture velocity between events
        const displacement = event.detail.endY - event.detail.initY
        const time = (event.detail.endTime - event.detail.initTime) / 1000
        const slideVelocity = Math.round(displacement / time) || 0

        if (slideVelocity > 600) {
            isVelocityReached = true
        } else {
            isVelocityReached = false
        }

        if ($coords.y < 0 || $coords.y + event.detail.sy < 0) {
            return
        }
        await coords.update(
            ($coords) => ({
                x: $coords.x + event.detail.sx,
                y: $coords.y + event.detail.sy,
            }),
            { duration: 0 }
        )
    }

    async function handleSlideEnd() {
        const contentHeight = parseInt(getComputedStyle(content).height)
        const isThresholdUnreached = fromLeft ? viewportLength / 2 > $coords.x : contentHeight / 2 > $coords.y
        if (isThresholdUnreached && !isVelocityReached) {
            await open()
        } else {
            isVelocityReached = false
            await close()
        }
    }

    export function isDrawerOpen(): boolean {
        return isOpen
    }

    export async function open(): Promise<void> {
        isOpen = true
        await coords.set({ x: 0, y: 0 }, { duration: 650, easing: quintOut })
    }

    export async function close(): Promise<void> {
        await coords.set(
            {
                x: fromLeft ? -viewportLength : 0,
                y: fromLeft ? 0 : viewportLength,
            },
            {
                duration: 450,
                easing: quintOut,
            }
        )
        isOpen = false
        if (!preventClose) {
            dispatch('close')
        }
    }

    const getScale = (coord: number, scale: number): number => (viewportLength - coord) / scale

    $: dimOpacity = getScale(fromLeft ? -$coords.x : $coords.y, 1800)
    $: contentOpacity = getScale(fromLeft ? -$coords.x : $coords.y, 100)
</script>

<drawer class="absolute top-0 {zIndex}" class:invisible={!isOpen}>
    <dim-zone
        class="fixed h-screen w-screen"
        use:slidable={{ use: !preventClose }}
        on:slideMove={handleSlideMove}
        on:slideEnd={handleSlideEnd}
        on:tap={close}
    >
        <div id="dim" class="h-screen" style="--opacity: {dimOpacity}" />
    </dim-zone>
    <content
        bind:this={content}
        use:slidable={{ use: !fromLeft && !preventClose, preventSlide }}
        on:slideMove={handleSlideMove}
        on:slideEnd={handleSlideEnd}
        on:tap={() => (preventSlide = false)}
        class="fixed bottom-0 overflow-auto w-screen h-screen bg-white dark:bg-gray-800 {classes}"
        class:darkmode={darkModeEnabled}
        style="--y: {fromLeft ? 0 : $coords.y}px; 
			--x: {fromLeft ? $coords.x : 0}px; 
			--opacity: {contentOpacity}; 
			--height: {fromLeft && '100vh'};
			--border-radius: {fromLeft ? '0' : '24px 24px 0 0'};
			--display-mark: {fromLeft ? 'none' : 'block'};
            --top-mark: 8px;
            --blur: {backgroundBlur ? '10px' : '0px'};
            --tw-bg-opacity: {backgroundBlur ? 0.8 : 1};"
    >
        <slot />
    </content>
</drawer>

<style type="text/scss">
    content {
        will-change: transform;
        transform: translate(var(--x), var(--y));
        border-radius: var(--border-radius);
        height: var(--height);
        opacity: var(--opacity);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        --bg-mark-color: #d0d0d0;
        --top-mark: 8px;
        &.darkmode {
            --bg-mark-color: #405985;
        }
    }

    // Rounded rectangle slide mark
    content:before {
        display: var(--display-mark);
        content: '';
        position: sticky;
        width: 48px;
        height: 4px;
        left: calc(50% - 48px / 2 - 0.5px);
        top: var(--top-mark);
        border-radius: 8px;
        z-index: 100;
        background: var(--bg-mark-color);
    }

    #dim {
        will-change: opacity;
        background-color: rgba(0, 0, 0, var(--opacity));
    }

    .invisible {
        display: none;
    }
</style>
