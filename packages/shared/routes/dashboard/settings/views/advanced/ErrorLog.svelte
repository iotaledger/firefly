<script lang="typescript">
    import { Button, Text, ButtonSize } from 'shared/components'
    import { localize } from '@core/i18n'
    import { openPopup } from 'shared/lib/popup'

    function handleErrorLogClick(): void {
        openPopup({ type: 'errorLog' })
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.errorLog.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.errorLog.description')}</Text>
<Button size={ButtonSize.Medium} inlineStyle="min-width: 156px;" onClick={handleErrorLogClick}>
    {localize('views.settings.errorLog.title')}
</Button>
