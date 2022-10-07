<script lang="typescript">
    import { Button, Text, ButtonVariant, ButtonSize } from 'shared/components'
    import { localize } from '@core/i18n'
    import { openPopup } from 'shared/lib/popup'
    import { deleteProfile } from '@contexts/settings'

    function handleDeleteClick() {
        openPopup({
            type: 'confirmation',
            props: {
                title: localize('popups.deleteProfile.title'),
                hint: localize('popups.deleteProfile.confirmation'),
                warning: true,
                confirmText: localize('actions.delete'),
                onConfirm: deleteProfile,
            },
        })
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.deleteProfile.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.deleteProfile.description')}</Text>
<Button
    size={ButtonSize.Medium}
    inlineStyle="min-width: 156px;"
    variant={ButtonVariant.Warning}
    onClick={handleDeleteClick}
>
    {localize('views.settings.deleteProfile.title')}
</Button>
