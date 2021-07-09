<script>
    import { Icon, Text } from 'shared/components'

    export let locale

    export let fromAlias = ''

    export let toAddress = ''
    export let toAmount = 0
    let shouldDisplaySendTo = fromAlias && toAddress && toAmount

    export let remainderAddress = ''
    export let remainderAmount = 0
    let shouldDisplayRemainder = remainderAddress && remainderAmount
</script>

<div class="p-8 flex flex-col w-full items-center justify-center text-center">
    <Icon icon="ledger" width="48" height="48" classes="mb-6 text-gray-800 dark:text-white" />
    {#if shouldDisplaySendTo || shouldDisplayRemainder}
        <Text type="p" classes="mb-6 px-16">{locale('popups.ledgerConfirmation.transactionConfirm')}</Text>
        {#if shouldDisplaySendTo}
            <div>
                <Text type="h5" highlighted classes="mb-3">{locale('general.from')}</Text>
                <Text type="p" classes="mb-6">{fromAlias}</Text>
            </div>
            <div>
                <Text type="h5" highlighted classes="mb-3">{locale('general.sendTo')}</Text>
                <Text type="pre" classes="mb-6">{toAddress}</Text>
            </div>
            <div>
                <Text type="h5" highlighted classes="mb-3">{locale('general.amount')}</Text>
                <Text type="p" classes="mb-6">{toAmount}</Text>
            </div>
        {/if}

        {#if shouldDisplayRemainder}
            <div>
                <Text type="h5" highlighted classes="mb-3">{locale('general.remainderAddress')}</Text>
                <Text type="pre" classes="mb-6">{remainderAddress}</Text>
            </div>
            <div>
                <Text type="h5" highlighted classes="mb-3">{locale('general.amount')}</Text>
                <Text type="pre" classes="mb-6">{remainderAmount}</Text>
            </div>
        {/if}
    {:else}
        <Text type="p" classes="mb-6 px-16">{locale('popups.ledgerConfirmation.confirm')}</Text>
    {/if}
</div>
