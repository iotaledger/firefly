<script lang="ts">
    import { OnboardingButton } from '@ui'

    import { selectedWallet } from '@core/wallet'
    import { localize } from '@core/i18n'
    import { resetMintTokenDetails } from '@core/wallet'

    import { closePopup, openPopup, PopupId } from '@auxiliary/popup'
    import { TextHintVariant } from 'shared/components/enums'

    // TODO(2.0) This should check if it has account outputs now.
    $: hasAccounts = $selectedWallet.balances?.accounts.length > 0

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
                    title: localize('popups.noAlias.title'),
                    hint: localize('popups.noAlias.description'),
                    variant: TextHintVariant.Warning,
                    confirmText: localize('actions.createAlias'),
                    onConfirm: () => {
                        closePopup()
                        openPopup({
                            id: PopupId.AliasConfirmation,
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
