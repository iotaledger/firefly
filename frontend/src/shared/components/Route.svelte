<script>
    import { fly, scale } from 'svelte/transition'
    import { path } from '@shared-lib/router'

    export let route = null
    export let primary = true
    export let secondary = false
    export let left = false
    export let transparent = false
</script>

<style type="text/scss">
    div {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background: var(--app-bg-color);
        &.transparent {
            background: none;
        }
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
