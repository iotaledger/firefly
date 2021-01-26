<script lang="typescript">
    import { getContext } from 'svelte'
    import { ActivityRow, Text } from 'shared/components'
    import { shuffleArray } from 'shared/lib/helpers'

    export let locale

    const accounts = getContext('walletAccounts')
    $: transactions = shuffleArray($accounts.map((acc) => acc.transactions).flat())
</script>

<div data-label="latest-transactions" class="h-full p-8 flex-grow flex flex-col">
    <Text type="h4" classes="mb-5">{locale('general.latest_transactions')}</Text>
    <div class="overflow-y-auto flex-auto h-1 space-y-2">
        {#each transactions as transaction}
            <ActivityRow
                {...transaction}
                color={$accounts.find((acc) => acc.transactions.find((tx) => tx.hash === transaction.hash))?.color} />
        {/each}
    </div>
</div>
