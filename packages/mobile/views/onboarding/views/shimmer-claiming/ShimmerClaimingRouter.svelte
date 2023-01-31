<script lang="typescript">
    import { ClaimRewardsView, SuccessView } from './views'
    import { ShimmerClaimingRoute, shimmerClaimingRoute } from '../../../../lib/routers'
</script>

{#if $shimmerClaimingRoute === ShimmerClaimingRoute.ClaimRewards}
    <ClaimRewardsView />
{:else if $shimmerClaimingRoute === ShimmerClaimingRoute.Success}
    <SuccessView />
{/if}
