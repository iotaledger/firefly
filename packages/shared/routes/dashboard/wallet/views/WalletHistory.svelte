<script lang="typescript">
    import { ActivityRow, Illustration, Text } from 'shared/components'
    import { accountRoute, walletRoute } from 'shared/lib/router'
    import { AccountRoutes, WalletRoutes } from 'shared/lib/typings/routes'
    import type { AccountMessage, WalletAccount } from 'shared/lib/wallet'
    import { selectedAccountId, selectedMessage } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import type { Readable, Writable } from 'svelte/store'
    import { get } from 'svelte/store'

    export let locale

    const accounts = getContext<Writable<WalletAccount[]>>('walletAccounts')
    const transactions = getContext<Readable<AccountMessage[]>>('walletTransactions')
    const accountsLoaded = getContext<Writable<boolean>>('walletAccountsLoaded')

    function handleTransactionClick(transaction) {
        const sourceAccount = get(accounts).find((acc) => acc.index === transaction.account)
        if (sourceAccount) {
            selectedAccountId.set(sourceAccount.id)
            selectedMessage.set(transaction)
            walletRoute.set(WalletRoutes.Account)
            accountRoute.set(AccountRoutes.Init)
        } else {
            console.error('Could not find source account')
        }
    }
</script>

<div data-label="latest-transactions" class="h-full p-8 flex-grow flex flex-col">
    <Text type="h4" classes="mb-5">{locale('general.latest_transactions')}</Text>
    {#if $accountsLoaded}
        <div class="overflow-y-auto flex-auto h-1 space-y-2">
            {#if $transactions?.length}
                {#each $transactions as transaction}
                    <ActivityRow
                        {...transaction}
                        onClick={() => handleTransactionClick(transaction)}
                        color={$accounts.find((acc) => acc.index === transaction.account)?.color} />
                {/each}
            {:else}
                <div class="h-full flex flex-col items-center justify-center text-center">
                    <Illustration width="50%" illustration="no-history" />
                    <Text secondary classes="mt-6">{locale('general.no_recent_history')}</Text>
                </div>
            {/if}
        </div>
    {/if}
</div>
