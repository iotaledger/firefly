<script lang="ts">
    import { ShimmerClaimingAccountTile } from '@ui'
    import { IShimmerClaimingAccount } from '@contexts/onboarding'

    export let shimmerClaimingAccounts: IShimmerClaimingAccount[]
</script>

{#if shimmerClaimingAccounts && shimmerClaimingAccounts?.length > 0}
    <div class="flex-auto overflow-y-auto space-y-3 w-full scrollable-y">
        {#each shimmerClaimingAccounts as shimmerClaimingAccount}
            <ShimmerClaimingAccountTile {shimmerClaimingAccount} />
        {/each}
    </div>
{/if}
