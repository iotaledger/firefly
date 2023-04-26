<script lang="ts">
    import { Platform } from '@core/app'
    import { OnboardingRoute, onboardingRoute } from '@core/router'
    import features from '@features/features'
    import { Transition } from 'shared/components'
    import { NetworkSetupRouter } from './views'
    import ChooseOnboardingFlowView from './views/ChooseOnboardingFlowView.svelte'
    import WelcomeView from './views/WelcomeView.svelte'
    import CreateProfileRouter from './views/create-profile/CreateProfileRouter.svelte'
    import CompleteOnboardingRouter from './views/complete-onboarding/CompleteOnboardingRouter.svelte'

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
{:else if $onboardingRoute === OnboardingRoute.CompleteOnboarding}
    <Transition>
        <CompleteOnboardingRouter />
    </Transition>
{/if}
