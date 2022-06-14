<script lang="typescript">
    import { appSettings, appVersionDetails } from '@core/app'
    import { localize } from '@core/i18n'
    import { activeProfile } from '@core/profile'
    import { Button, Text } from 'shared/components'
    import { Platform } from 'shared/lib/platform'
    import { setClipboard } from 'shared/lib/utils'
    import { onMount } from 'svelte'

    const { loggedIn } = $activeProfile ?? {}

    let contentApp = ''
    let contentSystem = ''

    const combineValues = (values): string =>
        values.map((c) => (c.label ? `${localize(c.label)}: ${c.value}` : c.value)).join('\r\n')

    onMount(() => {
        const appVars = [
            {
                label: '',
                value: localize('general.version', {
                    values: { version: $appVersionDetails?.currentVersion },
                }),
            },
        ]
        if ($activeProfile && $loggedIn) {
            appVars.push({
                label: 'views.settings.language.title',
                value: $appSettings?.language,
            })
            appVars.push({
                label: 'views.settings.currency.title',
                value: $activeProfile?.settings?.currency,
            })
            appVars.push({
                label: 'views.settings.networkConfiguration.nodeConfiguration.title',
                value: localize(
                    `views.settings.networkConfiguration.nodeConfiguration.${
                        $activeProfile?.settings?.clientOptions?.automaticNodeSelection ? 'automatic' : 'manual'
                    }`
                ),
            })
            appVars.push({
                label: 'general.nodeList',
                value: $activeProfile?.settings?.clientOptions?.nodes?.map((node) => node?.url)?.toString(),
            })
        }
        contentApp = combineValues(appVars)
        void Platform.getDiagnostics().then((values) => (contentSystem = combineValues(values)))
    })

    function handleCopyClick(): void {
        setClipboard(contentApp + '\r\n' + contentSystem)
    }
</script>

<div class="mb-5">
    <Text type="h4">{localize('popups.diagnostics.title')}</Text>
</div>
<Text type="pre" secondary>{contentApp}</Text>
<Text type="pre" secondary>{contentSystem}</Text>
<div class="flex w-full justify-center pt-8">
    <Button classes="w-1/2" onClick={() => handleCopyClick()}>{localize('actions.copy')}</Button>
</div>
