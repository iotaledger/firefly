<script lang="ts">
    import { ActionsView, SettingsView } from './views'

    import { ProfileRoute, profileRoute } from '@/routers'
</script>

{#if $profileRoute === ProfileRoute.Actions}
    <ActionsView />
{:else if $profileRoute === ProfileRoute.Settings}
    <SettingsView />
{/if}
