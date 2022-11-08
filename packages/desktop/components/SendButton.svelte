<script lang="typescript">
    import { localize } from '@core/i18n'
    import { resetLedgerPreparedOutput, resetShowInternalVerificationPopup } from '@core/ledger'
    import { resetNewTokenTransactionDetails } from '@core/wallet'
    import { openPopup } from '@auxiliary/popup'
    import { OnboardingButton } from '@ui'

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
    primaryText={localize('general.sendAssets')}
    secondaryText={localize('general.sendAssetToAddress')}
    onClick={onSendClick}
/>
