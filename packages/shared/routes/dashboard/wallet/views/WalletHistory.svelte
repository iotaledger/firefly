<script lang="typescript">
    import { ActivityRow, Icon, Text } from 'shared/components'
    import { accountRoute, walletRoute } from 'shared/lib/router'
    import { AccountRoutes, WalletRoutes } from 'shared/lib/typings/routes'
    import { AccountMessage, isSyncing, selectedAccountId, selectedMessage, syncAccounts, WalletAccount } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import type { Readable, Writable } from 'svelte/store'
    import { get } from 'svelte/store'

    export let locale

    const accounts = getContext<Writable<WalletAccount[]>>('walletAccounts')
    const transactions = getContext<Readable<AccountMessage[]>>('walletTransactions')

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
    <div class="w-full flex flex-row justify-between items-start">
        <Text type="p" smaler bold classes="mb-5">{locale('general.latest_transactions')}</Text>
        <button on:click={syncAccounts} class:pointer-events-none={$isSyncing}>
            <Icon icon="refresh" classes="{$isSyncing && 'animate-spin'} text-gray-500 dark:text-white" />
        </button>
    </div>
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
                <Text secondary>{locale('general.no_recent_history')}</Text>
            </div>
        {/if}
    </div>
</div>
