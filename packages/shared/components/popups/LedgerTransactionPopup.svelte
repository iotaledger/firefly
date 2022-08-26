<script lang="typescript">
    import { Animation, Text } from 'shared/components'
    import { KeyValueBox } from 'shared/components/atoms'
    import {
        formatAddressForLedger,
        resetLedgerSendConfirmationProps,
        resetLedgerMintNativeTokenProps,
    } from '@core/ledger'
    import { openPopup } from 'shared/lib/popup'
    import { onDestroy } from 'svelte'
    import { Locale } from '@core/i18n'
    import { localize } from '@core/i18n'

    export let locale: Locale

    export let toAddress = ''
    export let toAmount = null
    export let needsToShowPopupAfterwards = true
    export let sendConfirmationPopupProps = null
    export let mintNativeTokenPopupProps = null

    const getPopupLocaleData = (prop: string): string => {
        const basePath = 'popups.ledgerTransaction'
        return `${basePath}.${prop}`
    }

    onDestroy(() => {
        if (needsToShowPopupAfterwards) {
            if (sendConfirmationPopupProps) {
                openPopup({
                    type: 'sendConfirmation',
                    props: sendConfirmationPopupProps,
                })
                resetLedgerSendConfirmationProps()
            } else if (mintNativeTokenPopupProps) {
                openPopup({
                    type: 'mintNativeTokenForm',
                    props: mintNativeTokenPopupProps,
                })
                resetLedgerMintNativeTokenProps()
            }
        }
    })
</script>

<Text type="h4" classes="mb-4">{locale(getPopupLocaleData('title'))}</Text>
<Text type="p" classes="mb-4" secondary>{locale(getPopupLocaleData('info'))}</Text>

<div class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Animation
        width="100%"
        animation="ledger-bg-desktop"
        classes="absolute transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    />
    <Animation animation="ledger-confirm-address-desktop" />
</div>
<div class="flex flex-col space-y-2">
    {#if sendConfirmationPopupProps}
        <KeyValueBox keyText={localize('general.sendTo')} valueText={formatAddressForLedger(toAddress)} />

        <KeyValueBox keyText={localize('general.amount')} valueText={toAmount} />
        <!-- <div class="rounded-lg bg-gray-50 dark:bg-gray-800 p-5 text-center">
            <Text type="h5" highlighted classes="mb-2">{locale('general.sendTo')}</Text>
            <Text type="pre" classes="mb-4">{formatAddressForLedger(toAddress)}</Text>

            <Text type="h5" highlighted classes="mb-2">{locale('general.amount')}</Text>
            <Text type="pre">{formatAmount(toAmount)}</Text>
        </div> -->
    {:else if mintNativeTokenPopupProps}
        <KeyValueBox keyText="Name" valueText={mintNativeTokenPopupProps.name} />
        <KeyValueBox keyText="Symbol" valueText={mintNativeTokenPopupProps.symbol} />
    {/if}
</div>

<style>
    .transaction {
        max-height: 30vh;
    }
</style>
