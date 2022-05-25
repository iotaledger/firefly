<!--
	@component GradientPicker, allows to choose a color 
    keeping his saturation and lightness levels in a desired state.
    
    @todo Implement swipe gestures to allow visualizing while 
    touching the bar. 
-->
<script type="typescript">
    import { createEventDispatcher } from 'svelte'
    import { fade } from 'svelte/transition'
    import { quintInOut } from 'svelte/easing'

    const dispatch = createEventDispatcher()
    const SATURATION = 0.5
    const LIGHTNESS = 0.65

    /**
     * Transform HSL to RGB color model values
     * HSL (for hue, saturation, lightness) are alternative
     * representation of the RGB color model.
     * Implemented formula: https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB_alternative
     */
    function hsl2rgb(h: number, s: number, l: number): [number, number, number] {
        const a = s * Math.min(l, 1 - l)
        const f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
        return [f(0), f(8), f(4)]
    }

    /**
     * Transform RGB values to HEX color string
     */
    const rgb2hex = (r: number, g: number, b: number): string =>
        '#' +
        [r, g, b]
            .map((x) =>
                Math.round(x * 255)
                    .toString(16)
                    .padStart(2)
            )
            .join('')

    const getColor = (color, s, l) => rgb2hex(...hsl2rgb(color, s, l))
</script>

<section
    in:fade={{ duration: 200, easing: quintInOut }}
    out:fade={{ duration: 300, easing: quintInOut }}
    class="flex h-12 w-full mt-4 rounded-lg overflow-hidden"
>
    {#each Array.from(Array(256).keys()) as color}
        <button
            on:touchend={() => dispatch('input', `${getColor(color, SATURATION, LIGHTNESS)}`)}
            class="h-12 w-0.5"
            style="background: hsl({color}, 50%,65%)"
        />
    {/each}
</section>
