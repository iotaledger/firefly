<script lang="typescript">
    import { formatNumber, parseCurrency } from '@core/i18n'
    import { createEventDispatcher } from 'svelte'

    // Props
    export let min = 0
    export let max = 100
    export let id = null
    export let decimals = 0
    export let value: string

    // Node Bindings
    let container = null
    let thumb = null
    let progressBar = null
    let element = null

    // Internal State
    let elementX = null
    let currentThumb = null
    let holding = false
    let thumbHover = false

    // Dispatch 'change' events
    const dispatch = createEventDispatcher()

    // Mouse shield used onMouseDown to prevent any mouse events penetrating other elements,
    // ie. hover events on other elements while dragging. Especially for Safari
    const mouseEventShield = document.createElement('div')
    mouseEventShield.setAttribute('class', 'mouse-over-shield')
    mouseEventShield.addEventListener('mouseover', (e) => {
        e.preventDefault()
        e.stopPropagation()
    })

    function resizeWindow(): void {
        elementX = element.getBoundingClientRect().left
    }

    // Allows both bind:value and on:change for parent value retrieval
    function setValue(val: number): void {
        value = formatNumber(val, undefined, undefined, 0)
        dispatch('change', { value })
    }

    function onTrackEvent(e): void {
        // Update value immediately before beginning drag
        updateValueOnEvent(e)
        onDragStart(e)
    }

    function onDragStart(e): void {
        // If mouse event add a pointer events shield
        if (e.type === 'mousedown') document.body.append(mouseEventShield)
        currentThumb = thumb
    }

    function onDragEnd(e): void {
        // If using mouse - remove pointer event shield
        if (e.type === 'mouseup') {
            if (document.body.contains(mouseEventShield)) document.body.removeChild(mouseEventShield)
            // Needed to check whether thumb and mouse overlap after shield removed
            if (isMouseInElement(e, thumb)) thumbHover = true
        }
        currentThumb = null
    }

    // Check if mouse event cords overlay with an element's area
    function isMouseInElement(event, element): boolean {
        const rect = element.getBoundingClientRect()
        const { clientX: x, clientY: y } = event
        if (x < rect.left || x >= rect.right) return false
        if (y < rect.top || y >= rect.bottom) return false
        return true
    }

    function calculateNewValue(clientX): void {
        // Find distance between cursor and element's left cord (20px / 2 = 10px) - Center of thumb
        const delta = clientX - (elementX + 10)

        // Use width of the container minus (5px * 2 sides) offset for percent calc
        let percent = (delta * 100) / (container.clientWidth - 10)

        // Limit percent 0 -> 100
        percent = percent < 0 ? 0 : percent > 100 ? 100 : percent

        // Limit value min -> max
        setValue(Math.floor((percent / 100) * (max - min) * 10 ** decimals) / 10 ** decimals + min)
    }

    // Handles both dragging of touch/mouse as well as simple one-off click/touches
    function updateValueOnEvent(e): boolean {
        // touchstart && mousedown are one-off updates, otherwise expect a currentPointer node
        if (!currentThumb && e.type !== 'touchstart' && e.type !== 'mousedown') return false

        if (e.stopPropagation) e.stopPropagation()
        if (e.preventDefault) e.preventDefault()

        // Get client's x cord either touch or mouse
        const clientX = e.type === 'touchmove' || e.type === 'touchstart' ? e.touches[0].clientX : e.clientX

        calculateNewValue(clientX)
    }

    // React to left position of element relative to window
    $: if (element) elementX = element.getBoundingClientRect().left

    // Set a class based on if dragging
    $: holding = Boolean(currentThumb)

    // Update progressbar and thumb styles to represent value
    $: if (progressBar && thumb) {
        let percent = ((parseCurrency(value) - min) * 100) / (max - min)
        percent = Math.max(Math.min(percent, 100), 0)
        const offsetLeft = (container.clientWidth - 10) * (percent / 100) + 5

        // Update thumb position + active range track width
        thumb.style.left = `${offsetLeft}px`
        progressBar.style.width = `${offsetLeft}px`
    }
</script>

<svelte:window
    on:touchmove|nonpassive={updateValueOnEvent}
    on:touchcancel={onDragEnd}
    on:touchend={onDragEnd}
    on:mousemove={updateValueOnEvent}
    on:mouseup={onDragEnd}
    on:resize={resizeWindow}
/>
<div class="range">
    <div
        class="range__wrapper"
        tabindex="0"
        bind:this={element}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={parseCurrency(value)}
        {id}
        on:mousedown={onTrackEvent}
        on:touchstart={onTrackEvent}
    >
        <div class="range__track" bind:this={container}>
            <div class="range__track--highlighted bg-blue-500" bind:this={progressBar} />
            <div
                class="range__thumb bg-blue-500"
                class:range__thumb--holding={holding}
                bind:this={thumb}
                on:touchstart={onDragStart}
                on:mousedown={onDragStart}
                on:mouseover={() => (thumbHover = true)}
                on:focus={() => (thumbHover = true)}
                on:mouseout={() => (thumbHover = false)}
                on:blur={() => (thumbHover = false)}
            />
        </div>
    </div>
</div>

<svelte:head>
    <style>
        .mouse-over-shield {
            position: fixed;
            top: 0px;
            left: 0px;
            height: 100%;
            width: 100%;
            background-color: rgba(255, 0, 0, 0);
            z-index: 10000;
            cursor: grabbing;
        }
    </style>
</svelte:head>

<style>
    .range {
        position: relative;
        flex: 1;
        cursor: pointer;
    }

    .range__wrapper {
        min-width: 100%;
        position: relative;
        padding: 0.5rem;
        box-sizing: border-box;
        outline: none;
    }

    .range__wrapper:focus-visible > .range__track {
        box-shadow: 0 0 0 2px white, 0 0 0 3px var(--track-focus, #6185ff);
    }

    .range__track {
        height: 6px;
        background-color: var(--track-bgcolor, #d8e3f5);
        border-radius: 999px;
    }

    .range__track--highlighted {
        width: 0;
        height: 6px;
        position: absolute;
        border-radius: 999px;
    }

    .range__thumb {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        width: 20px;
        height: 20px;
        cursor: pointer;
        border-radius: 999px;
        margin-top: -8px;
        transition: box-shadow 100ms;
        user-select: none;
        box-shadow: var(--thumb-boxshadow, 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 0px 2px 1px rgba(0, 0, 0, 0.2));
    }

    .range__thumb--holding {
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 2px 1px rgba(0, 0, 0, 0.2),
            0 0 0 6px var(--thumb-holding-outline, rgba(113, 119, 250, 0.3));
    }
</style>
