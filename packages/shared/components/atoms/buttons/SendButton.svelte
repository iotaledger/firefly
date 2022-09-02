<script lang="typescript">
    import { localize } from '@core/i18n'
    import { resetNewTransactionDetails } from '@core/wallet'
    import { openPopup } from '@lib/popup'
    import { OnboardingButton } from 'shared/components/atoms'

    function handleSendClick(): void {
        resetNewTransactionDetails()
        openPopup({
            type: 'sendForm',
            overflow: true,
        })
    }
</script>

<OnboardingButton
    primaryText={localize('general.sendFunds')}
    secondaryText={localize('general.sendTokensToAddress')}
    onClick={handleSendClick}
/>
