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

    onMount(() => {
        const appVars = [
            {
                label: '',
                value: localize('general.version', {
                    values: { version: $appVersionDetails?.currentVersion },
                }),
            },
            {
                label: 'views.settings.language.title',
                value: $appSettings?.language,
            },
        ]
        if ($activeProfile && $loggedIn) {
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
        contentApp = concatenateInfo(appVars)
        void Platform.getDiagnostics().then((values) => (contentSystem = concatenateInfo(values)))
    })

    function handleCopyClick(): void {
        setClipboard(contentApp + '\r\n' + contentSystem)
    }

    function concatenateInfo(infoList: { label?: string; value: string }[]): string {
        return infoList.map((info) => (info.label ? `${localize(info.label)}: ${info.value}` : info.value)).join('\r\n')
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
