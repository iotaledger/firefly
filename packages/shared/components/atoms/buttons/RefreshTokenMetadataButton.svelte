<script lang="typescript">
    import { localize } from '@core/i18n'
    import { refreshAccountAssetsForActiveProfile } from '@core/wallet'
    import { showAppNotification } from '@lib/notifications'
    import { openPopup } from '@lib/popup'
    import { OnboardingButton } from 'shared/components'

    function refreshTokenMetadata() {
        refreshAccountAssetsForActiveProfile(true)
        showAppNotification({
            type: 'success',
            message: 'All token metadata has been reset and refreshed',
            alert: true,
        })
    }

    function handleRefreshTokenMetadata() {
        openPopup({
            type: 'confirmation',
            props: {
                title: localize('actions.refreshTokenMetadata'),
                hint: localize('general.refreshTokenMetadataHint'),
                warning: true,
                confirmText: localize('actions.reset'),
                onConfirm: refreshTokenMetadata,
            },
        })
    }
</script>

<OnboardingButton
    primaryText={localize('actions.refreshTokenMetadata')}
    secondaryText={localize('general.refreshTokenMetadataDescription')}
    onClick={handleRefreshTokenMetadata}
/>
