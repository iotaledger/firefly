<script lang="ts">
    import { Platform } from '@core/app'
    import features from '@features/features'
    import { Transition } from 'shared/components'
    import { CompleteOnboardingRoute } from './complete-onboarding-route.enum'
    import { completeOnboardingRoute } from './complete-onboarding-router'
    import EnterNameView from './views/EnterNameView.svelte'
    import EnterPinView from './views/EnterPinView.svelte'
    import FinishOnboardingView from './views/FinishOnboardingView.svelte'

    $: if (features.analytics.onboardingRoute.enabled && $completeOnboardingRoute) {
        Platform.trackEvent('complete-onboarding-route', { route: $completeOnboardingRoute })
    }
</script>

{#if $completeOnboardingRoute === CompleteOnboardingRoute.EnterName}
    <Transition>
        <EnterNameView />
    </Transition>
{:else if $completeOnboardingRoute === CompleteOnboardingRoute.EnterPin}
    <Transition>
        <EnterPinView />
    </Transition>
{:else if $completeOnboardingRoute === CompleteOnboardingRoute.FinishOnboarding}
    <Transition>
        <FinishOnboardingView />
    </Transition>
{/if}
