<script lang="typescript">
    import { onDestroy } from 'svelte'
    import { LedgerAnimation, KeyValueBox, Text } from 'shared/components'
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
<LedgerAnimation animation="ledger-confirm-prompt-desktop" classes="mb-4" />
<div class="flex flex-col space-y-2">
    {#if hasSendConfirmationProps}
        {#if hash}
            <KeyValueBox keyText={localize('general.hash')} valueText={formatHexString(hash)} />
        {:else}
            <KeyValueBox keyText={localize('general.sendTo')} valueText={toAddress} />
            <KeyValueBox keyText={localize('general.amount')} valueText={toAmount} />
        {/if}
    {/if}
</div>
