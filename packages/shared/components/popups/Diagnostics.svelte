<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { appSettings } from 'shared/lib/appSettings'
    import { versionDetails } from 'shared/lib/appUpdater'
    import { Platform } from 'shared/lib/platform'
    import { activeProfile } from 'shared/lib/profile'
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
            value: locale('general.version', {
                values: { version: $versionDetails.currentVersion },
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
            value: $activeProfile.settings.currency,
        })
        appVars.push({
            label: 'views.settings.networkConfiguration.nodeConfiguration.title',
            value: locale(
                `views.settings.networkConfiguration.nodeConfiguration.${
                    $activeProfile.settings.networkConfig.automaticNodeSelection ? 'automatic' : 'manual'
                }`
            ),
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
