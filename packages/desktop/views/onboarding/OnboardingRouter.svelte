<script lang="ts">
    import { Platform } from '@core/app'
    import { OnboardingRoute, onboardingRoute } from '@core/router'
    import { Transition } from 'shared/components'
    import {
        // routers
        AppSetupRouter,
        // views
        CongratulationsView,
        LedgerSetupRouter,
        NetworkSetupRouter,
        ProfileBackupRouter,
        ProfileRecoveryRouter,
        ProfileSetupRouter,
        ShimmerClaimingRouter,
        StorageProtectionSetupRouter,
        StrongholdSetupRouter,
    } from './views'
    import features from '@features/features'

    $: if (features.analytics.onboardingRoute.enabled && $onboardingRoute)
        Platform.trackEvent('onboarding-route', { route: $onboardingRoute })
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
{:else if $onboardingRoute === OnboardingRoute.LedgerSetup}
    <Transition>
        <LedgerSetupRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.StrongholdSetup}
    <Transition>
        <StrongholdSetupRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.StorageProtectionSetup}
    <Transition>
        <StorageProtectionSetupRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.ProfileBackup}
    <Transition>
        <ProfileBackupRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.ProfileRecovery}
    <Transition>
        <ProfileRecoveryRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.ShimmerClaiming}
    <Transition>
        <ShimmerClaimingRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.Congratulations}
    <Transition>
        <CongratulationsView />
    </Transition>
{/if}
