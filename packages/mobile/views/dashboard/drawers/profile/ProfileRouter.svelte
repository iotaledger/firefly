<script lang="typescript">
    import { profileRoute, ProfileRoute } from '../../../../lib/routers'
    import { ActionsView, SettingsView } from './views'
</script>

{#if $profileRoute === ProfileRoute.Actions}
    <ActionsView />
{:else if $profileRoute === ProfileRoute.Settings}
    <SettingsView />
{/if}
