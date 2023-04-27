<script lang="ts">
    import { Platform } from '@core/app'
    import features from '@features/features'
    import { Transition } from 'shared/components'
    import { OnboardingRoute } from './onboarding-route.enum'
    import { onboardingRoute } from './onboarding-router'
    import { ChooseOnboardingFlowView, CompleteOnboardingRouterView, WelcomeView } from './views'
    import { CreateProfileRouterView } from './views/create-profile'
    import { NetworkSetupRouterView } from './views/network-setup'
    import { RestoreProfileRouter } from './views/restore-profile'

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
        <NetworkSetupRouterView />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.ChooseOnboardingFlow}
    <Transition>
        <ChooseOnboardingFlowView />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.CreateProfile}
    <Transition>
        <CreateProfileRouterView />
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
