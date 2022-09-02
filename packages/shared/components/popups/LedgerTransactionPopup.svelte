<script lang="typescript">
    import { onDestroy } from 'svelte'
    import { Animation, KeyValueBox, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import {
        resetLedgerSendConfirmationProps,
        resetLedgerMintNativeTokenConfirmationProps,
        ledgerSendConfirmationProps,
        ledgerMintNativeTokenConfirmationProps,
    } from '@core/ledger'
    import { isActiveLedgerProfile } from '@core/profile'
    import { formatHexString } from '@core/utils'
    import { openPopup } from '@lib/popup'

    export let toAddress: string
    export let toAmount: string
    export let hash: string

    const hasSendConfirmationProps = (toAddress && toAmount) || hash
    // const hasMintNativeTokenConfirmationProps = false

    onDestroy(() => {
        if ($isActiveLedgerProfile) {
            if ($ledgerSendConfirmationProps) {
                openPopup({
                    type: 'sendConfirmation',
                    props: $ledgerSendConfirmationProps,
                    overflow: true,
                })
                resetLedgerSendConfirmationProps()
            } else if ($ledgerMintNativeTokenConfirmationProps) {
                openPopup({
                    type: 'mintNativeTokenForm',
                    props: $ledgerMintNativeTokenConfirmationProps,
                })
                resetLedgerMintNativeTokenConfirmationProps()
            }
        }
    })
</script>

<Text type="h4" classes="mb-4">{localize('popups.ledgerTransaction.title')}</Text>
<Text type="p" classes="mb-4" secondary>{localize('popups.ledgerTransaction.info')}</Text>

<div class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Animation
        width="100%"
        animation="ledger-bg-desktop"
        classes="absolute transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    />
    <Animation animation="ledger-confirm-address-desktop" />
</div>
<div class="flex flex-col space-y-2">
    {#if hasSendConfirmationProps}
        {#if hash}
            <KeyValueBox keyText={localize('general.hash')} valueText={formatHexString(hash)} />
        {:else}
            <KeyValueBox keyText={localize('general.sendTo')} valueText={toAddress} />
            <KeyValueBox keyText={localize('general.amount')} valueText={toAmount} />
        {/if}
        <!-- <div class="rounded-lg bg-gray-50 dark:bg-gray-800 p-5 text-center">
            <Text type="h5" highlighted classes="mb-2">{locale('general.sendTo')}</Text>
            <Text type="pre" classes="mb-4">{formatAddressForLedger(toAddress)}</Text>

            <Text type="h5" highlighted classes="mb-2">{locale('general.amount')}</Text>
            <Text type="pre">{formatAmount(toAmount)}</Text>
        </div> -->
        <!-- {:else if hasMintNativeTokenConfirmationProps} -->
        <!--     <KeyValueBox keyText="Name" valueText={mintNativeTokenConfirmationPopupProps.name} /> -->
        <!--     <KeyValueBox keyText="Symbol" valueText={mintNativeTokenConfirmationPopupProps.symbol} /> -->
    {/if}
</div>
