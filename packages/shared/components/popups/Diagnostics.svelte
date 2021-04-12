<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { appSettings } from 'shared/lib/appSettings'
    import { versionDetails } from 'shared/lib/appUpdater'
    import { Electron } from 'shared/lib/electron'
    import { activeProfile } from 'shared/lib/profile'
    import { setClipboard } from 'shared/lib/utils'

    export let locale

    let contentApp = ''
    let contentSystem = ''

    const combineValues = (values) => values.map((c) => (c.label ? `${locale(c.label)}: ${c.value}` : c.value)).join('\r\n')

    let appVars = [
        {
            label: '',
            value: locale('views.dashboard.security.version.title', { values: { version: $versionDetails.currentVersion } }),
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
            label: 'views.settings.nodeSettings.title',
            value: locale(`general.${$activeProfile.settings.automaticNodeSelection ? 'automaticNodeSelection' : 'manualNodeSelection'}`),
        })
    }

    contentApp = combineValues(appVars)

    Electron.getDiagnostics().then((values) => (contentSystem = combineValues(values)))

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
