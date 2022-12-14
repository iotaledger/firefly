<script lang="typescript">
    import { profileRoute, ProfileRoute } from '../../../../lib/routers'
    import { ActionsView, SettingsRouterView } from './views'
</script>

{#if $profileRoute === ProfileRoute.Actions}
    <ActionsView />
{:else if $profileRoute === ProfileRoute.Settings}
    <SettingsRouterView />
{/if}
