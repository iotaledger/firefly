<script language="typescript">
    import { Button, Text } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { openPopup } from 'shared/lib/popup'

    export let id

    function handleDiagnosticsClick() {
        openPopup({ type: 'diagnostics' })
    }
</script>

<section {id} class="w-full sm:w-3/4">
    <Text type="h4" classes="mb-3">{localize('views.settings.diagnostics.title')}</Text>
    <Text type="p" secondary classes="mb-5">{localize('views.settings.diagnostics.description')}</Text>
    <Button medium inlineStyle="min-width: 156px;" onClick={handleDiagnosticsClick}>
        {localize('views.settings.diagnostics.title')}
    </Button>
</section>
