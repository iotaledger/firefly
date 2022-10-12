<script lang="typescript">
    import { localize } from '@core/i18n'
    import { closePopup, openPopup } from '@lib/popup'
    import { OnboardingButton } from 'shared/components'
    import { selectedAccount } from '@core/account'

    $: hasAliases = $selectedAccount.balances?.aliases.length > 0

    function handleMintNativeToken(): void {
        if (hasAliases) {
            openPopup({
                type: 'mintNativeTokenForm',
            })
        } else {
            openPopup({
                type: 'confirmation',
                props: {
                    title: localize('popups.noAlias.title'),
                    hint: localize('popups.noAlias.description'),
                    warning: true,
                    confirmText: localize('actions.createAlias'),
                    onConfirm: () => {
                        closePopup()
                        openPopup({
                            type: 'aliasConfirmation',
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
