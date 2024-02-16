<script lang="ts">
    import { OnboardingButton } from '@ui'

    import { selectedWallet } from '@core/wallet'
    import { localize } from '@core/i18n'
    import { resetMintTokenDetails } from '@core/wallet'

    import { closePopup, openPopup, PopupId } from '@auxiliary/popup'
    import { TextHintVariant } from '@ui/enums'

    $: hasAccounts = $selectedWallet?.accountOutputs.length > 0

    function onMintNativeTokenClick(): void {
        resetMintTokenDetails()
        if (hasAccounts) {
            openPopup({
                id: PopupId.MintNativeTokenForm,
            })
        } else {
            openPopup({
                id: PopupId.Confirmation,
                props: {
                    title: localize('popups.noAccountOuput.title'),
                    hint: localize('popups.noAccountOuput.description'),
                    variant: TextHintVariant.Warning,
                    confirmText: localize('actions.createAccount'),
                    onConfirm: () => {
                        closePopup()
                        openPopup({
                            id: PopupId.AccountConfirmation,
                        })
                    },
                },
            })
        }
    }
</script>

<OnboardingButton
    primaryText={localize('actions.mintNativeToken')}
    secondaryText={localize('general.mintNativeTokenDescription')}
    onClick={onMintNativeTokenClick}
/>
