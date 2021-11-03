<script language="typescript">
    import { Button, Text } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { openPopup } from 'shared/lib/popup'

    export let id

    function handleErrorLogClick() {
        openPopup({ type: 'errorLog' })
    }
</script>

<section {id} class="w-full sm:w-3/4">
    <Text type="h4" classes="mb-3">{localize('views.settings.errorLog.title')}</Text>
    <Text type="p" secondary classes="mb-5">{localize('views.settings.errorLog.description')}</Text>
    <Button medium inlineStyle="min-width: 156px;" onClick={handleErrorLogClick}>
        {localize('views.settings.errorLog.title')}
    </Button>
</section>
