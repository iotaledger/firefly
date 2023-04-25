<script lang="ts">
    import { Platform } from '@core/app'
    import { OnboardingRoute, onboardingRoute } from '@core/router'
    import features from '@features/features'
    import { Transition } from 'shared/components'
    import {
        CongratulationsView,
        LedgerSetupRouter,
        NetworkSetupRouter,
        ProfileBackupRouter,
        ProfileRecoveryRouter,
        ShimmerClaimingRouter,
        StorageProtectionSetupRouter,
        StrongholdSetupRouter,
    } from './views'
    import ChooseFlowView from './views/ChooseFlowView.svelte'
    import WelcomeView from './views/WelcomeView.svelte'

    $: if (features.analytics.onboardingRoute.enabled && $onboardingRoute) {
        Platform.trackEvent('onboarding-route', { route: $onboardingRoute })
    }
</script>

{#if $onboardingRoute === OnboardingRoute.Welcome}
    <Transition>
        <WelcomeView />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.NetworkSetup}
    <Transition>
        <NetworkSetupRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.ChooseFlow}
    <Transition>
        <ChooseFlowView />
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
