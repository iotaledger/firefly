<script lang="ts">
    import { SETTINGS_ROUTE_META } from '@/contexts/settings'
    import { settingsRoute, SettingsRoute } from '@/routers'
    import { SettingsIndexView } from './views'
</script>

{#if $settingsRoute === SettingsRoute.Init}
    <SettingsIndexView />
{:else}
    <svelte:component this={SETTINGS_ROUTE_META[$settingsRoute].view} />
{/if}
