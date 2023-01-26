<script lang="typescript">
    import { EnterNameView, SetupView, SetupClaimedView, SetupRecoveredView } from './views'
    import { ProfileSetupRoute, profileSetupRoute } from '../../../../lib/routers'
</script>

{#if $profileSetupRoute === ProfileSetupRoute.Setup}
    <SetupView />
{:else if $profileSetupRoute === ProfileSetupRoute.SetupClaimed}
    <SetupClaimedView />
{:else if $profileSetupRoute === ProfileSetupRoute.EnterName}
    <EnterNameView />
{:else if $profileSetupRoute === ProfileSetupRoute.SetupRecovered}
    <SetupRecoveredView />
{/if}
