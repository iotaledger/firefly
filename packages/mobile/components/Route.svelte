<script lang="ts">
    import { appRoute, AppRoute } from '@/routers'

    export let route: AppRoute
</script>

{#if $appRoute === route}
    <slot />
{/if}
