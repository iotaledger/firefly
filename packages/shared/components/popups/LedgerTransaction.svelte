<script lang="ts">
    import { Illustration, Text } from 'shared/components'
    import { showAppNotification } from 'shared/lib/notifications';
    import { formatUnitBestMatch } from 'shared/lib/units';

    export let locale

    export let onCancel = () => {}

    export let remainderAddress = ''
    export let remainderAmount = -1
    let shouldDisplayRemainderAddress = Boolean(remainderAddress)
    let shouldDisplayRemainderAmount = remainderAmount !== -1

    export let toAddress = ''
    export let toAmount = -1
    let shouldDisplaySendTo = Boolean(toAddress) && toAmount !== -1

    let isInvalid = false

    const onInvalid = () => {
        /**
         * NOTE: Because getLocaleData is used multiple times, we need to make sure
         * that the user isn't spammed with error messages for when the transaction data
         * is invalid.
         */
        if(!isInvalid) {
            isInvalid = true

            showAppNotification({
                type: 'error',
                message: locale('error.send.transaction'),
            })
        }
        onCancel()
    }

    const getLocaleData = (prop: string): string => {
        /**
         * CAUTION: If neither the sendTo nor remainderAddress contain
         * valid information then Firefly should cancel the transaction
         * (to be retried) and notify the user.
         */
        if(!shouldDisplaySendTo && !shouldDisplayRemainderAddress)
            onInvalid()

        const basePath = 'popups.ledgerTransaction'
        const popupType = shouldDisplaySendTo ? 'transaction' : 'remainderAddress'

        return `${basePath}.${popupType}.${prop}`
    }

    const formatAmount = (amountRaw: number): string => {
        return formatUnitBestMatch(amountRaw)
    }
</script>

<Text type="h4" classes="mb-6">{locale(getLocaleData('title'))}</Text>
<Text type="p" classes="mb-6" secondary>{locale(getLocaleData('info'))}</Text>

<div class="illustration w-full h-1/2 bg-white dark:bg-gray-900 flex justify-center">
    <Illustration illustration="ledger-confirm-address-desktop" />
</div>

{#if shouldDisplaySendTo}
    <div class={`rounded-lg bg-gray-50 dark:bg-gray-800 p-4 ${shouldDisplayRemainderAddress ? 'mb-4' : ''}`}>
        <Text type="h5" highlighted classes="mb-3">{locale('general.sendTo')}</Text>
        <Text type="pre" classes="mb-6">{toAddress}</Text>

        <Text type="h5" highlighted classes="mb-3">{locale('general.amount')}</Text>
        <Text type="pre">{formatAmount(toAmount)}</Text>
    </div>
{/if}
{#if shouldDisplayRemainderAddress}
    <div class="rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
        <Text type="h5" highlighted classes="mb-3">{locale(`general.${shouldDisplayRemainderAmount ? 'r' : 'newR'}emainderAddress`)}</Text>
        <Text type="pre" classes={shouldDisplayRemainderAmount ? 'mb-6' : ''}>{remainderAddress}</Text>

        {#if shouldDisplayRemainderAmount}
            <Text type="h5" highlighted classes="mb-3">{locale('general.amount')}</Text>
            <Text type="pre">{formatAmount(remainderAmount)}</Text>
        {/if}
    </div>
{/if}
