<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { appSettings, appVersionDetails } from '@core/app'
    import { Platform } from 'shared/lib/platform'
    import { activeProfile } from '@core/profile'
    import { setClipboard } from 'shared/lib/utils'
    import { Locale } from '@core/i18n'

    export let locale: Locale

    let contentApp = ''
    let contentSystem = ''

    const combineValues = (values) =>
        values.map((c) => (c.label ? `${locale(c.label)}: ${c.value}` : c.value)).join('\r\n')

    const appVars = [
        {
            label: '',
            value: locale('views.dashboard.security.version.title', {
                values: { version: $appVersionDetails.currentVersion },
            }),
        },
    ]

    if ($activeProfile) {
        appVars.push({
            label: 'views.settings.language.title',
            value: $appSettings.language,
        })
        appVars.push({
            label: 'views.settings.currency.title',
            value: $activeProfile?.settings.currency,
        })
        appVars.push({
            label: 'views.settings.networkConfiguration.nodeConfiguration.title',
            value: locale(
                `views.settings.networkConfiguration.nodeConfiguration.${
                    $activeProfile?.settings.clientOptions.automaticNodeSelection ? 'automatic' : 'manual'
                }`
            ),
        })
        appVars.push({
            label: 'general.nodeList',
            value: $activeProfile?.settings.clientOptions.nodes.map((node) => node?.url).toString(),
        })
    }

    contentApp = combineValues(appVars)

    void Platform.getDiagnostics().then((values) => (contentSystem = combineValues(values)))

    const handleCopyClick = () => {
        setClipboard(contentApp + '\r\n' + contentSystem)
    }
</script>

<div class="mb-5">
    <Text type="h4">{locale('popups.diagnostics.title')}</Text>
</div>
<Text type="pre" secondary>{contentApp}</Text>
<Text type="pre" secondary>{contentSystem}</Text>
<div class="flex w-full justify-center pt-8">
    <Button classes="w-1/2" onClick={() => handleCopyClick()}>{locale('actions.copy')}</Button>
</div>
