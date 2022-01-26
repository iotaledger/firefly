<script lang="typescript">
    import { Button, Checkbox, Text } from 'shared/components'
    import { appSettings, initAppSettings } from 'shared/lib/appSettings'
    import { localize } from 'shared/lib/i18n'
    import { openPopup } from 'shared/lib/popup'

    function handleDiagnosticsClick() {
        openPopup({ type: 'diagnostics' })
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.diagnostics.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.diagnostics.description')}</Text>
<Button medium inlineStyle="min-width: 156px;" onClick={handleDiagnosticsClick}>
    {localize('views.settings.diagnostics.title')}
</Button>

<Text type="h5" classes="mb-3">{localize('views.settings.diagnostics.reporting.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.diagnostics.reporting.body')}</Text>
<Checkbox label={localize('views.settings.diagnostics.reporting.checkbox')} bind:checked={$appSettings.sendDiagnostics} />
{#if $appSettings.sendDiagnostics !== $initAppSettings.sendDiagnostics}
    <Text type="p" secondary classes="mt-4">
        {localize('views.settings.diagnostics.reporting.advice', { values: { sendDiagnostics: $appSettings.sendDiagnostics } })}
    </Text>
{/if}
