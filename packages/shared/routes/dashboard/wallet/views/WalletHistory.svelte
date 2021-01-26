<script lang="typescript">
    import { getContext } from 'svelte'
    import { ActivityRow, Text } from 'shared/components'

    export let locale

    const accounts = getContext('walletAccounts')
    const transactions = getContext('walletTransactions')
</script>

<div data-label="latest-transactions" class="h-full p-8 flex-grow flex flex-col">
    <Text type="h4" classes="mb-5">{locale('general.latest_transactions')}</Text>
    <div class="overflow-y-auto flex-auto h-1 space-y-2">
        {#each $transactions as transaction}
            <ActivityRow {...transaction} color={$accounts.find((acc) => acc.index === transaction.account)?.color} />
        {/each}
    </div>
</div>
