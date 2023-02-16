<script lang="ts">
    import { localize } from '@core/i18n'
    import { closePopup, openPopup } from '@auxiliary/popup'
    import { OnboardingButton } from 'shared/components'
    import { selectedAccount } from '@core/account'
    import { resetMintTokenDetails } from '@core/wallet'

    $: hasAliases = $selectedAccount.balances?.aliases.length > 0

    function handleMintNativeToken(): void {
        resetMintTokenDetails()
        if (hasAliases) {
            openPopup({
                id: 'mintNativeTokenForm',
            })
        } else {
            openPopup({
                id: 'confirmation',
                props: {
                    title: localize('popups.noAlias.title'),
                    hint: localize('popups.noAlias.description'),
                    warning: true,
                    confirmText: localize('actions.createAlias'),
                    onConfirm: () => {
                        closePopup()
                        openPopup({
                            id: 'aliasConfirmation',
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
    onClick={handleMintNativeToken}
/>
