<script lang="typescript">
    import { localize } from '@core/i18n'
    import { ActivityType, selectedAccountActivities } from '@core/wallet'
    import { closePopup, openPopup } from '@lib/popup'
    import { OnboardingButton } from 'shared/components'
    import { get } from 'svelte/store'

    $: aliases = get(selectedAccountActivities).filter((activity) => activity.type === ActivityType.Alias)

    function handleMintNativeToken() {
        if (aliases.length > 0) {
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
