<script lang="ts">
    import { appRoute, AppRoute } from '../lib/routers'

    export let route: AppRoute
</script>

{#if $appRoute === route}
    <slot />
{/if}
