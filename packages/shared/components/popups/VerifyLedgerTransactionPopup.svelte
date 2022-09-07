<script lang="typescript">
    import { KeyValueBox, Text, TextHint, LedgerAnimation } from 'shared/components'
    import { localize } from '@core/i18n'
    import { formatHexString } from '@core/utils'
    import { onDestroy } from 'svelte'
    import {
        isInternalTransaction,
        resetIsInternalTransaction,
    } from '@core/ledger/stores/is-internal-transaction.store'

    export let toAddress: string
    export let toAmount: string
    export let hash: string

    const hasSendConfirmationProps = (toAddress && toAmount) || hash

    const locale = $isInternalTransaction ? 'popups.verifyInternalLedgerTransaction' : 'popups.verifyLedgerTransaction'

    onDestroy(() => {
        resetIsInternalTransaction()
    })
</script>

<Text type="h4" classes="mb-4">{localize(`${locale}.title`)}</Text>
<Text type="p" classes="mb-4" secondary>{localize(`${locale}.info`)}</Text>

<div class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <LedgerAnimation animation="ledger-confirm-prompt-desktop" />
</div>
<div class="flex flex-col space-y-2">
    {#if hasSendConfirmationProps}
        {#if hash}
            <KeyValueBox keyText={localize('general.hash')} valueText={formatHexString(hash)} />
        {:else}
            <KeyValueBox keyText={localize('general.sendTo')} valueText={toAddress} />
            <KeyValueBox keyText={localize('general.amount')} valueText={toAmount} />
        {/if}
    {:else if $isInternalTransaction}
        <TextHint info text={localize('popups.verifyInternalLedgerTransaction.hint')} classes="pt-2" />
    {/if}
</div>
