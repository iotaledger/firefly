<script lang="typescript">
    import { Animation, Text } from 'shared/components'
    import { KeyValueBox } from 'shared/components/atoms'
    import { formatAddressForLedger, resetLedgerSendConfirmationProps } from '@core/ledger'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup, openPopup, popupState } from 'shared/lib/popup'
    import { onDestroy, onMount } from 'svelte'
    import { get } from 'svelte/store'
    import { Locale } from '@core/i18n'
    import { localize } from '@core/i18n'

    export let locale: Locale

    export let toAddress = ''
    export let toAmount = null
    export let sendConfirmationPopupProps = null

    export let onCancel: (..._: any[]) => void

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

    onMount(() => {
        /**
         * CAUTION: If sendTo valid information then Firefly should cancel the transaction
         * (to be retried) and notify the user.
         */
        if (!shouldDisplaySendTo) onInvalid()
    })

    onDestroy(() => {
        openPopup({
            type: 'sendConfirmation',
            props: sendConfirmationPopupProps,
        })

        resetLedgerSendConfirmationProps()
    })
</script>

<Text type="h4" classes="mb-6">{locale(getPopupLocaleData('title'))}</Text>
<Text type="p" classes="mb-6" secondary>{locale(getPopupLocaleData('info'))}</Text>

<div class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Animation
        width="100%"
        animation="ledger-bg-desktop"
        classes="absolute transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    />
    <Animation animation="ledger-confirm-address-desktop" />
</div>
<div class="flex flex-col space-y-2">
    {#if shouldDisplaySendTo}
        <KeyValueBox keyText={localize('general.sendTo')} valueText={formatAddressForLedger(toAddress)} />

        <KeyValueBox keyText={localize('general.amount')} valueText={toAmount} />
        <!-- <div class="rounded-lg bg-gray-50 dark:bg-gray-800 p-5 text-center">
            <Text type="h5" highlighted classes="mb-2">{locale('general.sendTo')}</Text>
            <Text type="pre" classes="mb-4">{formatAddressForLedger(toAddress)}</Text>

            <Text type="h5" highlighted classes="mb-2">{locale('general.amount')}</Text>
            <Text type="pre">{formatAmount(toAmount)}</Text>
        </div> -->
    {/if}
</div>

<style>
    .transaction {
        max-height: 30vh;
    }
</style>
