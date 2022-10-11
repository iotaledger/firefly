<script lang="typescript">
    import { Button, Text, ButtonSize } from 'shared/components'
    import { localize } from '@core/i18n'
    import { openPopup } from 'shared/lib/popup'

    function handleDiagnosticsClick() {
        openPopup({ type: 'diagnostics' })
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.diagnostics.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.diagnostics.description')}</Text>
<Button size={ButtonSize.Medium} inlineStyle="min-width: 156px;" onClick={handleDiagnosticsClick}>
    {localize('views.settings.diagnostics.title')}
</Button>
