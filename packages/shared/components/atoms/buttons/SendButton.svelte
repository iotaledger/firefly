<script lang="typescript">
    import { localize } from '@core/i18n'
    import { resetLedgerPreparedOutput, resetShowInternalVerificationPopup } from '@core/ledger'
    import { resetNewTokenTransactionDetails } from '@core/wallet'
    import { openPopup } from '@auxiliary/popup'
    import { OnboardingButton } from 'shared/components'

    function onSendClick(): void {
        resetNewTokenTransactionDetails()
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
