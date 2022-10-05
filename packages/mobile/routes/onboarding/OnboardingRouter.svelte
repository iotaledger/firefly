<script lang="typescript">
    import { Transition } from 'shared/components'
    import {
        // routers
        AppSetupRouter,
        CongratulationsView,
        NetworkSetupRouter,
        ProfileBackupRouter,
        ProfileSetupRouter,
        StorageProtectionSetupRouter,
        StrongholdSetupRouter,
    } from './views'
    import { OnboardingRoute, onboardingRoute } from '@core/router'
</script>

{#if $onboardingRoute === OnboardingRoute.AppSetup}
    <Transition>
        <AppSetupRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.NetworkSetup}
    <Transition>
        <NetworkSetupRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.ProfileSetup}
    <Transition>
        <ProfileSetupRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.ProfileBackup}
    <Transition transition={false}>
        <ProfileBackupRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.StrongholdSetup}
    <Transition>
        <StrongholdSetupRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.StorageProtectionSetup}
    <Transition transition={false}>
        <StorageProtectionSetupRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.Congratulations}
    <Transition>
        <CongratulationsView />
    </Transition>
{/if}
