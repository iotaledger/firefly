<script lang="ts">
    import { localize } from '@core/i18n'
    import { resetLedgerPreparedOutput, resetShowInternalVerificationPopup } from '@core/ledger'
    import { resetNewTokenTransactionDetails } from '@core/wallet'
    import { openPopup, PopupId } from '@desktop/auxiliary/popup'
    import { OnboardingButton } from '@ui'
    import { SendFlowRouter, sendFlowRouter } from '@views/dashboard/send-flow'
    import features from '@features/features'

    function onSendClick(): void {
        resetNewTokenTransactionDetails()
        resetLedgerPreparedOutput()
        resetShowInternalVerificationPopup()
        sendFlowRouter.set(new SendFlowRouter(undefined))
        openPopup({
            id: features.wallet.newSendFlow.enabled ? PopupId.SendFlow : PopupId.SendForm,
            overflow: true,
        })
    }
</script>

<OnboardingButton
    primaryText={localize('general.sendAssets')}
    secondaryText={localize('general.sendAssetToAddress')}
    onClick={onSendClick}
/>
