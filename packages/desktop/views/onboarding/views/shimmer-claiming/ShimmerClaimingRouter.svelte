<script lang="typescript">
    import { Transition } from 'shared/components'
    import { ClaimRewardsView, SuccessView } from './views'
    import { ShimmerClaimingRoute, shimmerClaimingRoute } from '@core/router'
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
