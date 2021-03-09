<script lang="typescript">
    import { ActivityDetail, ActivityRow, Icon, Text } from 'shared/components'
    import { selectedMessage } from 'shared/lib/wallet'

    export let locale
    export let transactions = []
    export let color = 'blue'

    function handleTransactionClick(transaction) {
        selectedMessage.set(transaction)
    }

    function handleBackClick() {
        selectedMessage.set(null)
    }
</script>

<div class="h-full p-8 flex flex-col flex-auto flex-grow flex-shrink-0">
    <div class="flex flex-row space-x-2 items-center mb-5">
        {#if $selectedMessage}
            <button on:click={handleBackClick}>
                <Icon icon="arrow-left" classes="text-blue-500" />
            </button>
        {/if}
        <Text type="h4">{locale('general.transactions')}</Text>
    </div>
    {#if $selectedMessage}
        <ActivityDetail onBackClick={handleBackClick} {...$selectedMessage} {locale} />
    {:else}
        <div class="overflow-y-auto flex-auto h-1 space-y-2">
            {#if transactions.length}
                {#each transactions as transaction}
                    <ActivityRow onClick={() => handleTransactionClick(transaction)} {...transaction} {color} />
                {/each}
            {:else}
                <div class="h-full flex flex-col items-center justify-center text-center">
                    <Text secondary>{locale('general.no_recent_history')}</Text>
                </div>
            {/if}
        </div>
    {/if}
</div>
