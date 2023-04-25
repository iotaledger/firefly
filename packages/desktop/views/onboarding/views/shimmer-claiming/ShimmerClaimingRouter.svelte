<script lang="ts">
    import { Platform } from '@core/app'
    import { ShimmerClaimingRoute, shimmerClaimingRoute } from '@core/router'
    import features from '@features/features'
    import { Transition } from 'shared/components'
    import { ClaimRewardsView, SuccessView } from './views'

    $: if (features.analytics.onboardingRoute.shimmerClaimingRoute.enabled && $shimmerClaimingRoute) {
        Platform.trackEvent('shimmer-claiming-route', { route: $shimmerClaimingRoute })
    }
</script>

{#if $shimmerClaimingRoute === ShimmerClaimingRoute.ClaimRewards}
    <Transition>
        <ClaimRewardsView />
    </Transition>
{:else if $shimmerClaimingRoute === ShimmerClaimingRoute.Success}
    <Transition>
        <SuccessView />
    </Transition>
{/if}
