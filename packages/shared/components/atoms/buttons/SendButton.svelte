<script lang="typescript">
    import { localize } from '@core/i18n'
    import { resetLedgerPreparedOutput, resetShowInternalVerificationPopup } from '@core/ledger'
    import { resetNewTransactionDetails } from '@core/wallet'
    import { openPopup } from '@lib/popup'
    import { OnboardingButton } from 'shared/components/atoms'

    function onSendClick(): void {
        resetNewTransactionDetails()
        resetLedgerPreparedOutput()
        resetShowInternalVerificationPopup()
        openPopup({
            type: 'sendForm',
            overflow: true,
        })
    }
</script>

<OnboardingButton
    primaryText={localize('general.sendFunds')}
    secondaryText={localize('general.sendTokensToAddress')}
    onClick={onSendClick}
/>
