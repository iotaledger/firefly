<script lang="typescript">
    import { onMount } from 'svelte'
    import { WalletTile } from 'shared/components'
    import { getAccounts } from '../../lib/core/profile-manager'
    import { StardustAccount } from '../../lib/typings/account'
    import { AccountMeta } from '@iota/wallet/out/types'

    let wallets: StardustAccount[] = [
        <StardustAccount>{
            meta: <AccountMeta>{
                index: 0,
                coinType: 4219,
                alias: 'A',
            },
        },
        <StardustAccount>{
            meta: <AccountMeta>{
                index: 1,
                coinType: 4219,
                alias: 'B',
            },
        },
        <StardustAccount>{
            meta: <AccountMeta>{
                index: 2,
                coinType: 4219,
                alias: 'C',
            },
        },
        <StardustAccount>{
            meta: <AccountMeta>{
                index: 3,
                coinType: 4219,
                alias: 'D',
            },
        },
        <StardustAccount>{
            meta: <AccountMeta>{
                index: 2,
                coinType: 4219,
                alias: 'E',
            },
        },
        <StardustAccount>{
            meta: <AccountMeta>{
                index: 3,
                coinType: 4219,
                alias: 'F',
            },
        },
        <StardustAccount>{
            meta: <AccountMeta>{
                index: 2,
                coinType: 4219,
                alias: 'G',
            },
        },
        <StardustAccount>{
            meta: <AccountMeta>{
                index: 3,
                coinType: 4219,
                alias: 'H',
            },
        },
    ]

    onMount(() => {
        getAccounts()
            .then((_wallets) => {
                if (_wallets?.length > 0) {
                    wallets = _wallets
                }
            })
            .catch((err) => {
                console.error(err)
            })
    })
</script>

{#if wallets && wallets.length > 0}
    <div class="flex-auto overflow-y-auto h-1 space-y-4 w-full scrollable-y scroll-secondary">
        {#each wallets as wallet}
            <WalletTile {wallet} />
        {/each}
    </div>
{/if}
