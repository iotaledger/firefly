<script lang="ts">
    import { appSettings, appVersionDetails, Platform } from '@core/app'
    import { localize } from '@core/i18n'
    import { activeProfile } from '@core/profile'
    import { Button, Text } from '@ui'
    import { setClipboard } from '@core/utils'
    import { onMount } from 'svelte'
    import { appNameBase } from '../../product'

    const { loggedIn } = $activeProfile ?? {}

    let contentApp = ''
    let contentSystem = ''

    onMount(() => {
        const appVars = [
            {
                label: 'views.settings.appName.title',
                value: appNameBase,
            },
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
                value: $activeProfile?.settings?.marketCurrency,
            })
            appVars.push({
                label: 'general.nodeList',
                value: $activeProfile?.clientOptions?.nodes?.map((node) => node?.url)?.toString(),
            })
        }
        contentApp = concatenateInfo(appVars)
        void Platform.getDiagnostics().then((values) => (contentSystem = concatenateInfo(values)))
    })

    function onCopyClick(): void {
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
<div class="flex w-full justify-center mt-8">
    <Button classes="w-full" onClick={onCopyClick}>{localize('actions.copy')}</Button>
</div>
