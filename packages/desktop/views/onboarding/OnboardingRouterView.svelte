<script lang="ts">
    import { Platform } from '@core/app'
    import features from '@features/features'
    import { Transition } from 'shared/components'
    import { OnboardingRoute } from './onboarding-route.enum'
    import { onboardingRoute } from './onboarding-router'
    import ChooseOnboardingFlowView from './views/ChooseOnboardingFlowView.svelte'
    import { CreateProfileRouter } from './views/create-profile'
    import { NetworkSetupRouter } from './views/network-setup'
    import { RestoreProfileRouter } from './views/restore-profile'
    import { CompleteOnboardingRouterView, WelcomeView } from './views'

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
{:else if $onboardingRoute === OnboardingRoute.ChooseOnboardingFlow}
    <Transition>
        <ChooseOnboardingFlowView />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.CreateProfile}
    <Transition>
        <CreateProfileRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.RestoreProfile}
    <Transition>
        <RestoreProfileRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.CompleteOnboarding}
    <Transition>
        <CompleteOnboardingRouterView />
    </Transition>
{/if}
CompleteOnboardingRouterView
