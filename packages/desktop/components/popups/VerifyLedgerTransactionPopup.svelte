<script lang="ts">
    import { KeyValueBox, Text, TextHint, LedgerAnimation } from '@ui'
    import { localize } from '@core/i18n'
    import { formatHexString } from '@core/utils'
    import { onDestroy } from 'svelte'
    import { verificationPopupMode, resetShowInternalVerificationPopup, VerificationPopupMode } from '@core/ledger'
    import { TextHintVariant, TextType } from '@ui/enums'
    import { AnimationEnum } from '@auxiliary/animation'

    export let toAddress: string
    export let toAmount: string
    export let hash: string

    const hasSendConfirmationProps = (toAddress && toAmount) || hash
    let locale
    $: switch ($verificationPopupMode) {
        case VerificationPopupMode.Block:
            locale = 'popups.verifyLedgerBlock'
            break
        case VerificationPopupMode.Internal:
            locale = 'popups.verifyInternalLedgerTransaction'
            break
        case VerificationPopupMode.Default:
            locale = 'popups.verifyLedgerTransaction'
            break
    }

    onDestroy(() => {
        resetShowInternalVerificationPopup()
    })
</script>

<Text type={TextType.h4} classes="mb-4">{localize(`${locale}.title`)}</Text>
<Text type={TextType.p} classes="mb-4" secondary>{localize(`${locale}.info`)}</Text>

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
    {:else if $verificationPopupMode === VerificationPopupMode.Internal}
        <TextHint variant={TextHintVariant.Info} text={localize('popups.verifyInternalLedgerTransaction.hint')} />
    {/if}
</div>
