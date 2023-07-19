<script lang="ts">
    import { KeyValueBox, Text, TextHint, LedgerAnimation } from 'shared/components'
    import { localize } from '@core/i18n'
    import { formatHexString } from '@core/utils'
    import { onDestroy } from 'svelte'
    import { showInternalVerificationPopup, resetShowInternalVerificationPopup } from '@core/ledger'
    import { AnimationEnum } from '@auxiliary/animation'

    export let toAddress: string
    export let toAmount: string
    export let hash: string

    const hasSendConfirmationProps = (toAddress && toAmount) || hash

    const locale = $showInternalVerificationPopup
        ? 'popups.verifyInternalLedgerTransaction'
        : 'popups.verifyLedgerTransaction'

    onDestroy(() => {
        resetShowInternalVerificationPopup()
    })
</script>

<Text type="h4" classes="mb-4">{localize(`${locale}.title`)}</Text>
<Text type="p" classes="mb-4" secondary>{localize(`${locale}.info`)}</Text>

<div class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <LedgerAnimation animation={AnimationEnum.LedgerConfirmPromptDesktop} />
</div>
<div class="flex flex-col space-y-2">
    {#if hasSendConfirmationProps}
        {#if hash}
            <KeyValueBox keyText={localize('general.hash')} valueText={formatHexString(hash)} />
        {:else}
            <KeyValueBox keyText={localize('general.sendTo')} valueText={toAddress} />
            <KeyValueBox keyText={localize('general.amount')} valueText={toAmount} />
        {/if}
    {:else if $showInternalVerificationPopup}
        <TextHint info text={localize('popups.verifyInternalLedgerTransaction.hint')} />
    {/if}
</div>
