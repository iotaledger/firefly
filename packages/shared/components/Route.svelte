<script lang="ts">
    import { AppRoute } from '@core/router'
    import { Writable } from 'svelte/store'

    export let route: AppRoute
    export let routeStore: Writable<AppRoute>
</script>

{#if $routeStore === route}
    <slot />
{/if}
