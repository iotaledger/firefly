<script language="typescript">
    import { Button, Text } from 'shared/components'
    import { localize } from 'shared/lib/i18n'

    export let id
</script>

<section {id} class="w-full sm:w-3/4">
    <Text type="h4" classes="mb-3">{localize('views.settings.stateExport.title')}</Text>
    <Text type="p" secondary classes="mb-5">{localize('views.settings.stateExport.description')}</Text>
    <Button medium inlineStyle="min-width: 156px;" disabled onClick={() => {}}>
        {localize('actions.exportState')}
    </Button>
</section>
