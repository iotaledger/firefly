<!--
	@component Drawer, slides in-out from the bottom or right and contains 
	the route contents handling scroll.
	Spans the height or width of the screen, with everything behind it visible but dimmed.
	Uses a Svelte Action to generate custom syntetic slide, swipe and tap events.
	
	@prop {boolean} [opened] - Opens drawer on load.
	@prop {boolean} [fromRight] - Slide from right side.
    @prop {boolean} [preventClose] - Prevent close the Drawer.
    @prop {string} [zIndex] - Main container Tailwind z-index. Ex. "z-40".
	
	@function {() => Promise<viod>} open - Opens drawer.
	@function {() => Promise<void>} close - Closes drawer.
-->
<script lang="typescript">
    import { appSettings } from 'shared/lib/appSettings'
    import { createEventDispatcher, onMount } from 'svelte'
    import { quintOut } from 'svelte/easing'
    import { HtmlTag, tick } from 'svelte/internal'
    import { tweened } from 'svelte/motion'

    $: darkModeEnabled = $appSettings.darkMode

    export let opened = false
    export let fromRight = false
    export let classes = ''
    export let fullScreen = false
    export let onClose = (): void => {}
    export let preventClose = false
    export let zIndex = 'z-30'

    const dispatch = createEventDispatcher()

    const viewportLength = fromRight ? window.innerWidth : window.innerHeight

    let content = undefined
    let isOpen = false

    const coords = tweened(
        {
            x: fromRight ? viewportLength : 0,
            y: fromRight ? 0 : viewportLength,
        },
        { duration: 350, easing: quintOut }
    )

    let preventScroll = true
    let hasScrollableParent = false
    const scrollHandler = (event) => {
        console.error(event.currentTarget.scrollTop)
        preventScroll = event.currentTarget.scrollTop === 0
    }

    function getScrollParent(node: Node & Element) {
        if (node === null) {
            return false
        }
        if (node.scrollHeight > node.clientHeight) {
            return true
        }
        const has = false
        if (node.hasChildNodes) {
            // console.error('yas!')
            node.childNodes.forEach((node) => {
                // console.error(node.scrollHeight)
                if (node.scrollHeight) return getScrollParent(node)
                else return false
                // if (node.scrollHeight > node.clientHeight) {
                //     has = true
                //     console.error(node.scrollHeight)
                // }
            })
            // return has
        }
    }

    onMount(async () => {
        if (opened) {
            await open()
        }
    })

    function slidable(node: HTMLElement, use: boolean = true) {
        if (!use) {
            return
        }
        let x: number
        let y: number
        let init: number

        function handleTouchstart(event: TouchEvent): void {
            if (node.scrollTop !== 0) {
                return
            }
            if (preventScroll) {
                // event.preventDefault()
                event.stopImmediatePropagation()
                event.stopPropagation()
            }

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
        if ($coords.y < 0) {
            preventScroll = false
            // // prepare for next scroll event if there will be one
            // content.scrollTop += 10
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
        const thresholdUnreached = fromRight ? viewportLength / 2 > $coords.x : contentHeight / 2 > $coords.y
        if (thresholdUnreached) {
            await open()
        } else {
            await close()
        }
    }

    export async function open(): Promise<void> {
        hasScrollableParent = getScrollParent(content)
        console.error(hasScrollableParent)
        isOpen = true
        await coords.set(
            {
                x: 0,
                y: 0,
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
            { duration: 550, easing: quintOut }
        )
        isOpen = false
        if (!preventClose) {
            dispatch('close')
            onClose()
        }
    }

    const getScale = (coord: number, scale: number): number => (viewportLength - coord) / scale

    $: dimOpacity = getScale(fromRight ? $coords.x : $coords.y, 1400)
    $: contentOpacity = getScale(fromRight ? $coords.x : $coords.y, 100)
</script>

<drawer class="absolute top-0 {zIndex}" class:invisible={!isOpen}>
    <dim-zone
        class="fixed h-screen w-screen"
        use:slidable={!preventClose}
        on:slideMove={handleSlideMove}
        on:slideEnd={handleSlideEnd}
        on:tap={close}
    >
        <div id="dim" class="h-screen" style="--opacity: {dimOpacity}" />
    </dim-zone>
    <content
        bind:this={content}
        use:slidable={!fromRight}
        on:slideMove={handleSlideMove}
        on:slideEnd={handleSlideEnd}
        on:scroll={scrollHandler}
        on:tap={() => (preventScroll = false)}
        class="fixed bottom-0 overflow-auto w-screen h-screen bg-white dark:bg-gray-800 {classes}"
        class:darkmode={darkModeEnabled}
        class:fullScreen
        style="--y: {fromRight ? 0 : $coords.y}px; 
			--x: {fromRight ? $coords.x : 0}px; 
			--opacity: {contentOpacity}; 
			--height: {fromRight && '100vh'};
			--border-radius: {fromRight ? '0' : '24px 24px 0 0'};
			--display-indicator: {fromRight ? 'none' : 'block'}"
    >
        <slot />
    </content>
</drawer>

<style type="text/scss">
    content {
        // scroll-padding-top: 10rem;
        will-change: transform;
        transform: translate(var(--x), var(--y));
        border-radius: var(--border-radius);
        height: var(--height);
        opacity: var(--opacity);
        --bg-indicator-color: #d8e3f5;
        --bg-top-shaddow: white;
        @apply from-white;
        &.darkmode {
            @apply from-gray-800;
            --bg-indicator-color: #405985;
            --bg-top-shaddow: rgb(37, 57, 95);
        }
    }

    // Rounded rectangle slide indicator
    content:before {
        display: var(--display-indicator);
        content: '';
        position: sticky;
        width: 48px;
        height: 4px;
        left: calc(50% - 48px / 2 - 0.5px);
        top: 8px;
        border-radius: 8px;
        z-index: 100;
        background: var(--bg-indicator-color);
        box-shadow: var(--bg-top-shaddow) 0 -199ch 20px 200ch;
    }

    #dim {
        will-change: opacity;
        background-color: rgba(0, 0, 0, var(--opacity));
    }

    .invisible {
        display: none;
    }
</style>
