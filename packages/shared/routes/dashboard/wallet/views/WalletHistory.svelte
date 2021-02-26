<script lang="typescript">
    import { ActivityRow, Text } from 'shared/components'
    import type { Account, MessageWithAccount } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import type { Readable, Writable } from 'svelte/store'

    export let locale

    const accounts = getContext<Writable<Account[]>>('walletAccounts')
    const transactions = getContext<Readable<MessageWithAccount[]>>('walletTransactions')
</script>

<div data-label="latest-transactions" class="h-full p-8 flex-grow flex flex-col">
    <Text type="h4" classes="mb-5">{locale('general.latest_transactions')}</Text>
    <div class="overflow-y-auto flex-auto h-1 space-y-2">
        {#each $transactions as transaction}
            <ActivityRow {...transaction} color={$accounts.find((acc) => acc.index === transaction.account)?.color} />
        {/each}
    </div>
</div>
