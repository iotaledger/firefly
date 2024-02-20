<script lang="ts">
    import { Button, Text, ButtonSize } from '@ui'
    import { localize } from '@core/i18n'
    import { openPopup, PopupId } from '@auxiliary/popup'

    function onErrorLogClick(): void {
        openPopup({ id: PopupId.ErrorLog })
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.errorLog.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.errorLog.description')}</Text>
<Button size={ButtonSize.Medium} inlineStyle="min-width: 156px;" onClick={onErrorLogClick}>
    {localize('views.settings.errorLog.title')}
</Button>
