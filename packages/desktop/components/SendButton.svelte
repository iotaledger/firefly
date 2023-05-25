<script lang="ts">
    import { localize } from '@core/i18n'
    import { resetLedgerPreparedOutput, resetShowInternalVerificationPopup } from '@core/ledger'
    import { resetNewTokenTransactionDetails } from '@core/wallet'
    import { openOverlay, PopupId } from '@auxiliary/popup'
    import { OnboardingButton } from '@ui'

    function onSendClick(): void {
        resetNewTokenTransactionDetails()
        resetLedgerPreparedOutput()
        resetShowInternalVerificationPopup()
        openOverlay({
            id: PopupId.SendForm,
            overflow: true,
        })
    }
</script>

<OnboardingButton
    primaryText={localize('general.sendAssets')}
    secondaryText={localize('general.sendAssetToAddress')}
    onClick={onSendClick}
/>
