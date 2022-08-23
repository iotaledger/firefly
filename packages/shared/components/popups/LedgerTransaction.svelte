<script lang="typescript">
    import { Animation, Text } from 'shared/components'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup, popupState } from 'shared/lib/popup'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'
    import { Locale } from '@core/i18n'
    import { formatAddressForLedger } from '@core/ledger'

    export let locale: Locale

    export let remainderAddress = ''
    export let remainderAmount = null
    export let toAddress = ''
    export let toAmount = null

    export let onCancel: (..._: any[]) => void

    const shouldDisplayRemainderAddress = remainderAddress?.length > 0
    const shouldDisplayRemainderAmount = remainderAmount !== null
    const shouldDisplaySendTo = toAddress?.length > 0 && toAmount !== null

    const onInvalid = () => {
        showAppNotification({
            type: 'error',
            message: locale('error.send.transaction'),
        })

        onCancel()

        if (get(popupState).active) closePopup(true)
    }

    const getPopupLocaleData = (prop: string): string => {
        const basePath = 'popups.ledgerTransaction'
        const popupType = shouldDisplaySendTo ? 'transaction' : 'remainderAddress'

        return `${basePath}.${popupType}.${prop}`
    }

    const formatAmount = (amountRaw: number): string => {
        if (amountRaw <= 0) onInvalid()

        return formatUnitBestMatch(amountRaw)
    }

    onMount(() => {
        /**
         * CAUTION: If neither the sendTo nor remainderAddress contain
         * valid information then Firefly should cancel the transaction
         * (to be retried) and notify the user.
         */
        if (!shouldDisplaySendTo && !shouldDisplayRemainderAddress) onInvalid()
    })
</script>

<Text type="h4" classes="mb-6">{locale(getPopupLocaleData('title'))}</Text>
<Text type="p" classes="mb-6" secondary>{locale(getPopupLocaleData('info'))}</Text>

<div class="relative w-full h-1/2 bg-white dark:bg-gray-900 flex justify-center content-center">
    <Animation
        width="100%"
        animation="ledger-bg-desktop"
        classes="absolute transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    />
    <Animation animation="ledger-confirm-address-desktop" />
</div>

<div class="transaction flex flex-col space-y-4 scrollable-y">
    {#if shouldDisplaySendTo}
        <div
            class={`rounded-lg bg-gray-50 dark:bg-gray-800 p-5 text-center ${
                shouldDisplayRemainderAddress ? 'mb-4' : ''
            }`}
        >
            <Text type="h5" highlighted classes="mb-2">{locale('general.sendTo')}</Text>
            <Text type="pre" classes="mb-4">{formatAddressForLedger(toAddress)}</Text>

            <Text type="h5" highlighted classes="mb-2">{locale('general.amount')}</Text>
            <Text type="pre">{formatAmount(toAmount)}</Text>
        </div>
    {/if}
    {#if shouldDisplayRemainderAddress}
        <div class="rounded-lg bg-gray-50 dark:bg-gray-800 p-5 text-center">
            <Text type="h5" highlighted classes="mb-2">
                {locale(`general.${shouldDisplayRemainderAmount ? 'r' : 'newR'}emainder`)}
            </Text>
            <Text type="pre" classes={shouldDisplayRemainderAmount ? 'mb-4' : ''}>
                {remainderAddress}
            </Text>

            {#if shouldDisplayRemainderAmount}
                <Text type="h5" highlighted classes="mb-2">{locale('general.amount')}</Text>
                <Text type="pre">{formatAmount(remainderAmount)}</Text>
            {/if}
        </div>
    {/if}
</div>

<style>
    .transaction {
        max-height: 30vh;
    }
</style>
