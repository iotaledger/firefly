<script lang="ts">
    import { Icon, Text } from 'shared/components'
    import { formatUnitBestMatch } from 'shared/lib/units';

    export let locale

    export let remainderAddress = ''
    export let remainderAmount = -1
    let shouldDisplayRemainderAddress = Boolean(remainderAddress)
    let shouldDisplayRemainderAmount = remainderAmount !== -1

    export let toAddress = ''
    export let toAmount = -1
    let shouldDisplaySendTo = Boolean(toAddress) && toAmount !== -1

    const formatAmount = (amountRaw: number): string => {
        return formatUnitBestMatch(amountRaw)
    }
</script>

<div class="p-8 flex flex-col w-full items-center justify-center text-center">
    <Icon icon="ledger" width="48" height="48" classes="mb-6 text-gray-800 dark:text-white" />
    {#if shouldDisplayRemainderAddress || shouldDisplaySendTo}
        <Text type="p" classes="mb-6 px-16">{locale('popups.ledgerConfirmation.transactionConfirm')}</Text>
        {#if shouldDisplaySendTo}
            <div>
                <Text type="h5" highlighted classes="mb-3">{locale('general.sendTo')}</Text>
                <Text type="pre" classes="mb-6">{toAddress}</Text>
            </div>
            <div>
                <Text type="h5" highlighted classes="mb-3">{locale('general.amount')}</Text>
                <Text type="pre" classes="mb-6">{formatAmount(toAmount)}</Text>
            </div>
        {/if}
        {#if shouldDisplayRemainderAddress}
            <div>
                <Text type="h5" highlighted classes="mb-3">{locale(`general.${shouldDisplayRemainderAmount ? 'r' : 'newR'}emainderAddress`)}</Text>
                <Text type="pre" classes="mb-6">{remainderAddress}</Text>
            </div>
        {/if}
        {#if shouldDisplayRemainderAmount}
            <div>
                <Text type="h5" highlighted classes="mb-3">{locale('general.amount')}</Text>
                <Text type="pre" classes="mb-6">{formatAmount(remainderAmount)}</Text>
            </div>
        {/if}
    {:else}
        <Text type="p" classes="mb-6 px-16">{locale('popups.ledgerConfirmation.confirm')}</Text>
    {/if}
</div>
