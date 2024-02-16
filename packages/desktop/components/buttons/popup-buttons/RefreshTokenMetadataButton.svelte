<script lang="ts">
    import { OnboardingButton } from '@ui'

    import { localize } from '@core/i18n'
    import { refreshWalletAssetsForActiveProfile } from '@core/wallet'

    import { showAppNotification } from '@auxiliary/notification'
    import { closePopup, openPopup, PopupId } from '@auxiliary/popup'
    import { TextHintVariant } from '@ui/enums'

    function refreshTokenMetadata(): void {
        refreshWalletAssetsForActiveProfile(true)
        showAppNotification({
            type: 'success',
            message: localize('notifications.refreshTokenMetadata.success'),
            alert: true,
        })
        closePopup()
    }

    function onRefreshTokenMetadataClick(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                title: localize('actions.refreshTokenMetadata'),
                hint: localize('general.refreshTokenMetadataHint'),
                variant: TextHintVariant.Warning,
                confirmText: localize('actions.reset'),
                onConfirm: refreshTokenMetadata,
            },
        })
    }
</script>

<OnboardingButton
    primaryText={localize('actions.refreshTokenMetadata')}
    secondaryText={localize('general.refreshTokenMetadataDescription')}
    onClick={onRefreshTokenMetadataClick}
/>
