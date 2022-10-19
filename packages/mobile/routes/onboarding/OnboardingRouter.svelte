<script lang="typescript">
    import {
        // routers
        AppSetupRouter,
        CongratulationsView,
        NetworkSetupRouter,
        ProfileBackupRouter,
        ProfileSetupRouter,
        ProfileRecoveryRouter,
        StorageProtectionSetupRouter,
        StrongholdSetupRouter,
    } from './views'
    import { OnboardingRoute, onboardingRoute } from '../../lib/core/router'
</script>

{#if $onboardingRoute === OnboardingRoute.AppSetup}
    <AppSetupRouter />
{:else if $onboardingRoute === OnboardingRoute.NetworkSetup}
    <NetworkSetupRouter />
{:else if $onboardingRoute === OnboardingRoute.ProfileSetup}
    <ProfileSetupRouter />
{:else if $onboardingRoute === OnboardingRoute.ProfileBackup}
    <ProfileBackupRouter />
{:else if $onboardingRoute === OnboardingRoute.StrongholdSetup}
    <StrongholdSetupRouter />
{:else if $onboardingRoute === OnboardingRoute.StorageProtectionSetup}
    <StorageProtectionSetupRouter />
{:else if $onboardingRoute === OnboardingRoute.ProfileRecovery}
    <ProfileRecoveryRouter />
{:else if $onboardingRoute === OnboardingRoute.Congratulations}
    <CongratulationsView />
{/if}
