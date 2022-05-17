<script lang="typescript">
    import { WalletTile } from 'shared/components'
    import { IAccount } from '@core/account'

    export let wallets: IAccount[]
</script>

{#if wallets && wallets.length > 0}
    <div class="flex-auto overflow-y-auto h-1 space-y-4 w-full scrollable-y scroll-secondary">
        {#each wallets as wallet}
            <WalletTile {wallet} />
        {/each}
    </div>
{/if}
