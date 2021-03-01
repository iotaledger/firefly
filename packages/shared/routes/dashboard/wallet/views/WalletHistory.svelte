<script lang="typescript">
    import { get } from 'svelte/store'
    import { getContext } from 'svelte'
    import { ActivityRow, Text } from 'shared/components'
    import { selectedAccountId, selectedMessage } from 'shared/lib/wallet'
    import { walletRoute, accountRoute } from 'shared/lib/router'
    import { WalletRoutes, AccountRoutes } from 'shared/lib/typings/routes'

    export let locale

    const accounts = getContext('walletAccounts')
    const transactions = getContext('walletTransactions')

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
    <div class="overflow-y-auto flex-auto h-1 space-y-2">
        {#each $transactions as transaction}
            <ActivityRow
                {...transaction}
                onClick={() => handleTransactionClick(transaction)}
                color={$accounts.find((acc) => acc.index === transaction.account)?.color} />
        {/each}
    </div>
</div>
