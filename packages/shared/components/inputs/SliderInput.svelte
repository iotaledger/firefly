<script lang="ts">
    import { formatNumber, parseCurrency } from '@core/i18n'

    export let min = 0
    export let max = 100
    export let id = null
    export let decimals = 0
    export let value: string
    export let disabled = false

    let container: HTMLElement = null
    let thumb: HTMLElement = null
    let progressBar: HTMLElement = null
    let element: HTMLElement = null

    let elementX: number = null
    let currentThumb: HTMLElement = null
    let holding = false
    let thumbHover = false

    // Mouse shield used onMouseDown to prevent any mouse events penetrating other elements,
    // ie. hover events on other elements while dragging. Especially for Safari
    const mouseEventShield = document.createElement('div')
    mouseEventShield.setAttribute('class', 'mouse-over-shield')
    mouseEventShield.addEventListener('mouseover', (event) => {
        event.preventDefault()
        event.stopPropagation()
    })

    function resizeWindow(): void {
        elementX = element.getBoundingClientRect().left
    }

    function setValue(val: number): void {
        value = formatNumber(val, undefined, decimals > 0 ? decimals : undefined, 0)
    }

    function onTrackEvent(event: TouchEvent | MouseEvent): void {
        if (disabled) {
            return
        }
        // Update value immediately before beginning drag
        updateValueOnEvent(event)
        onDragStart(event)
    }

    function onDragStart(event: TouchEvent | MouseEvent): void {
        if (disabled) {
            return
        }
        // If mouse event add a pointer events shield
        if (event.type === 'mousedown') {
            document.body.append(mouseEventShield)
        }
        currentThumb = thumb
    }

    function onDragEnd(event: TouchEvent | MouseEvent): void {
        if (disabled) {
            return
        }
        // If using mouse - remove pointer event shield
        if (event.type === 'mouseup') {
            if (document.body.contains(mouseEventShield)) document.body.removeChild(mouseEventShield)
            // Needed to check whether thumb and mouse overlap after shield removed
            if (isMouseInElement(event as MouseEvent, thumb)) thumbHover = true
        }
        currentThumb = null
    }

    // Check if mouse event cords overlay with an element's area
    function isMouseInElement(event: MouseEvent, element: HTMLElement): boolean {
        const rect = element.getBoundingClientRect()
        const { clientX: x, clientY: y } = event
        if (x < rect.left || x >= rect.right) {
            return false
        }
        if (y < rect.top || y >= rect.bottom) {
            return false
        }
        return true
    }

    function calculateNewValue(clientX: number): void {
        // Find distance between cursor and element's left cord (20px / 2 = 10px) - Center of thumb
        const delta = clientX - (elementX + 10)

        // Use width of the container minus (5px * 2 sides) offset for percent calc
        let percent = (delta * 100) / (container.clientWidth - 10)

        // Limit percent 0 -> 100
        percent = percent < 0 ? 0 : percent > 100 ? 100 : percent

        // Limit value min -> max
        const val = Math.floor((percent / 100) * (max - min) * 10 ** decimals) / 10 ** decimals + min
        setValue(val)
    }

    // Handles both dragging of touch/mouse as well as simple one-off click/touches
    function updateValueOnEvent(event: TouchEvent | MouseEvent): boolean {
        // touchstart && mousedown are one-off updates, otherwise expect a currentPointer node
        if (!currentThumb && event.type !== 'touchstart' && event.type !== 'mousedown') {
            return false
        }

        event.stopPropagation && event.stopPropagation()
        event.preventDefault && event.preventDefault()

        // Get client's x cord either touch or mouse
        const clientX =
            event.type === 'touchmove' || event.type === 'touchstart'
                ? (event as TouchEvent).touches[0].clientX
                : (event as MouseEvent).clientX

        calculateNewValue(clientX)
    }

    // React to left position of element relative to window
    $: element && (elementX = element.getBoundingClientRect().left)

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

<slider-input class="range" class:cursor-pointer={!disabled}>
    <range-wrapper
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
        <range-track class="range__track" bind:this={container}>
            <progress-bar
                bind:this={progressBar}
                class="range__track--highlighted
                {disabled ? 'bg-gray-400' : 'bg-blue-500'}"
            />
            <range-thumb
                class="range__thumb
                {disabled ? 'bg-gray-400' : 'bg-blue-500'}"
                class:range__thumb--holding={holding}
                class:cursor-pointer={!disabled}
                bind:this={thumb}
                on:touchstart={onDragStart}
                on:mousedown={onDragStart}
                on:mouseover={() => (thumbHover = true)}
                on:focus={() => (thumbHover = true)}
                on:mouseout={() => (thumbHover = false)}
                on:blur={() => (thumbHover = false)}
            />
        </range-track>
    </range-wrapper>
</slider-input>

<style lang="scss">
    :global(.mouse-over-shield) {
        @apply fixed;
        @apply top-0;
        @apply left-0;
        @apply h-full;
        @apply w-full;
        @apply bg-black;
        @apply opacity-0;
        @apply z-50;
        cursor: grabbing;
    }

    .range {
        @apply block;
        @apply relative;
        @apply flex-1;
    }

    .range__wrapper {
        @apply block;
        @apply relative;
        @apply box-border;
        @apply min-w-full;
        @apply outline-none;
        @apply p-2;

        &:focus-visible > .range__track {
            box-shadow: 0 0 0 2px white, 0 0 0 3px var(--track-focus, #6185ff);
        }
    }

    .range__track {
        @apply block;
        @apply rounded-full;
        @apply h-1.5;
        background-color: var(--track-bgcolor, #d8e3f5);
    }

    .range__track--highlighted {
        @apply block;
        @apply absolute;
        @apply rounded-full;
        @apply w-0;
        @apply h-1.5;
    }

    .range__thumb {
        @apply absolute;
        @apply flex;
        @apply items-center;
        @apply justify-center;
        @apply select-none;
        @apply rounded-full;
        @apply -mt-2;
        @apply w-5;
        @apply h-5;
        transition: box-shadow 100ms;
        box-shadow: var(--thumb-boxshadow, 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 0px 2px 1px rgba(0, 0, 0, 0.2));
    }

    .range__thumb--holding {
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 2px 1px rgba(0, 0, 0, 0.2),
            0 0 0 6px var(--thumb-holding-outline, rgba(113, 119, 250, 0.3));
    }
</style>
