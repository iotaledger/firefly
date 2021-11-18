<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { openUrl } from 'shared/lib/device'
    import { localize } from 'shared/lib/i18n'
    import { ExternalRoute } from 'shared/lib/typings/routes'

    const handleClick = () => {
        openUrl(ExternalRoute.Documentation)
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.documentation.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.documentation.description')}</Text>
<Button medium inlineStyle="min-width: 156px;" onClick={handleClick}>{localize('actions.readDocumentation')}</Button>
