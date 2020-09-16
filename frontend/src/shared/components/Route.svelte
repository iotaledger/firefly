<script>
    import { fly, scale } from 'svelte/transition'
    import { quintOut } from 'svelte/easing'
    import { readable } from 'svelte/store'

    import path from '@lib/router'

    export let route
    export let primary
    export let secondary
    export let left
    export let transparent
</script>

<style>
    div {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background: var(--bg);
    }
    div.transparent {
        background: none;
    }
</style>

{#if $path === route}
    {#if primary}
        <div class:transparent transition:scale={{ duration: 380, start: 0.95, oapcity: 0.9 }}>
            <slot />
        </div>
    {:else if secondary}
        <div class:transparent transition:scale={{ duration: 300, start: 1.05, opacity: 0 }}>
            <slot />
        </div>
    {:else}
        <div class:transparent transition:fly={{ x: left ? 360 : -360, duration: 280, opacity: 0 }}>
            <slot />
        </div>
    {/if}
{/if}
