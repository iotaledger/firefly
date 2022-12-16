<script lang="typescript">
    import { ProfileRoute, profileRoute } from '../../../../lib/routers'
    import { ActionsView, SettingsView } from './views'
</script>

{#if $profileRoute === ProfileRoute.Actions}
    <ActionsView />
{:else if $profileRoute === ProfileRoute.Settings}
    <SettingsView />
{/if}
