<script lang="ts">
    import { ShimmerClaimingAccountTile } from '@ui'
    import { IShimmerClaimingAccount } from '@contexts/onboarding'
    import { IBaseToken } from '@core/wallet/interfaces'

    export let shimmerClaimingAccounts: IShimmerClaimingAccount[]
    export let baseToken: IBaseToken
</script>

{#if shimmerClaimingAccounts && shimmerClaimingAccounts?.length > 0}
    <div class="flex-auto overflow-y-auto space-y-3 w-full scrollable-y">
        {#each shimmerClaimingAccounts as shimmerClaimingAccount}
            <ShimmerClaimingAccountTile {shimmerClaimingAccount} {baseToken} />
        {/each}
    </div>
{/if}
