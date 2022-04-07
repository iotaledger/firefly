<script type="typescript">
    import { createEventDispatcher } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { quintInOut } from 'svelte/easing';
	
    const dispatch = createEventDispatcher();
    
    function hsl2rgb(h: number, s: number, l: number) {
        let a = s * Math.min(l, 1 - l)
        let f = (n, k = ( n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), - 1)
        return [ f(0), f(8), f(4) ]
    }
    
    const rgb2hex = (r: number, g: number, b: number): string => '#' + [r, g, b].map(x => 
        Math.round(x * 255).toString(16).padStart(2)
    ).join('')

</script>

<section 
    in:fade={{ duration: 200, easing: quintInOut }}
    out:fade={{ duration: 300, easing: quintInOut }}
    class="flex h-12 w-full mt-4 rounded-lg overflow-hidden"
>
    {#each Array.from(Array(256).keys()) as color}
        <button 
            on:touchend={() => dispatch('input', `${rgb2hex(...hsl2rgb(color, 0.5, 0.65))}`)} 
            class="h-12 w-0.5"
            style="background: hsl({color}, 50%,65%)"
        ></button>
    {/each}
</section>