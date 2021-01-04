<script>
    import { fly, scale } from 'svelte/transition'
    import { view } from 'shared/lib/router'

    export let transition = true
    export let route = undefined
    export let primary = true
    export let secondary = false
    export let left = false
    export let transparent = false
</script>

<style type="text/scss">
    div {
        @apply absolute;
        @apply top-0;
        @apply left-0;
        @apply w-full;
        @apply h-full;
        background-color: var(--app-bg-color); // TODO: tailwindify
        &.transparent {
            @apply bg-transparent;
        }
    }
</style>

{#if $view === route}
    {#if transition}
        {#if primary}
            <div data-label="route" class:transparent transition:scale={{ duration: 380, start: 0.95, opacity: 0.9 }}>
                <slot />
            </div>
        {:else if secondary}
            <div data-label="route" class:transparent transition:scale={{ duration: 300, start: 1.05, opacity: 0 }}>
                <slot />
            </div>
        {:else}
            <div data-label="route" class:transparent transition:fly={{ x: left ? 360 : -360, duration: 280, opacity: 0 }}>
                <slot />
            </div>
        {/if}
    {:else}
        <slot />
    {/if}
{/if}
