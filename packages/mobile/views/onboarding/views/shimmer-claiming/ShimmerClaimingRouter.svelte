<script lang="ts">
    import { ClaimRewardsView, SuccessView } from './views'
    import { ShimmerClaimingRoute, shimmerClaimingRoute } from '@/routers'
</script>

{#if $shimmerClaimingRoute === ShimmerClaimingRoute.ClaimRewards}
    <ClaimRewardsView />
{:else if $shimmerClaimingRoute === ShimmerClaimingRoute.Success}
    <SuccessView />
{/if}
