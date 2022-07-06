<script lang="typescript">
    import { Transition } from 'shared/components'
    import { ClaimRewardsView } from './views'
    import { ShimmerClaimingRoute, shimmerClaimingRoute } from '@core/router'
</script>

{#if $shimmerClaimingRoute === ShimmerClaimingRoute.ClaimRewards}
    <Transition>
        <ClaimRewardsView />
    </Transition>
{/if}
