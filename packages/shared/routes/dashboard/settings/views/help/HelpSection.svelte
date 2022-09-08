<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { Platform } from 'shared/lib/platform'
    import { HelpAndInfoRoute } from '@core/router'

    export let route: HelpAndInfoRoute
    export let url: string
    export let actionLocale: string

    const handleClick = () => {
        Platform.openUrl(url)
    }
</script>

<Text type="h4" classes="mb-3">{localize(`views.settings.${route}.title`)}</Text>
<Text type="p" secondary classes="mb-5">{localize(`views.settings.${route}.description`)}</Text>
<Button inlineStyle="min-width: 156px;" onClick={handleClick}>{localize(`actions.${actionLocale}`)}</Button>
