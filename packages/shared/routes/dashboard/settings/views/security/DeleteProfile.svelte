<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup } from 'shared/lib/popup'
    import { wallet } from 'shared/lib/wallet'
    import { get } from 'svelte/store'

    function handleDeleteClick() {
        if (get(get(wallet).balanceOverview).balanceRaw > 0) {
            return showAppNotification({
                type: 'error',
                message: localize('error.profile.delete.nonEmptyAccounts'),
            })
        }
        openPopup({ type: 'deleteProfile' })
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.deleteProfile.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.deleteProfile.description')}</Text>
<Button medium inlineStyle="min-width: 156px;" warning onClick={handleDeleteClick}>
    {localize('views.settings.deleteProfile.title')}
</Button>
