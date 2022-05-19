<script lang="typescript">
    import { RewardClaimTile } from 'shared/components'
    import { IAccount } from '@core/account'

    export let accounts: IAccount[]
</script>

{#if accounts && accounts?.length > 0}
    <div class="flex-auto overflow-y-auto h-1 space-y-4 w-full scrollable-y scroll-secondary">
        {#each accounts as account}
            <RewardClaimTile {account} />
        {/each}
    </div>
{/if}
