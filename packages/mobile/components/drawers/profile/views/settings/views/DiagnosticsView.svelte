<script lang="ts">
    import { onMount } from 'svelte'

    import { Button, ButtonSize, Text, TextType } from '@ui'

    import { appSettings, appVersionDetails, Platform } from '@core/app'
    import { localize } from '@core/i18n'
    import { activeProfile } from '@core/profile'
    import { setClipboard } from '@core/utils'

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
            {
                label: 'views.settings.currency.title',
                value: $activeProfile?.settings?.currency,
            },
            {
                label: 'general.nodeList',
                value: $activeProfile?.clientOptions?.nodes?.map((node) => node?.url)?.toString(),
            },
        ]
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

<diagnostics-view class="flex-1 flex flex-col justify-between space-y-4">
    <div class="flex flex-col">
        <Text type={TextType.pre} secondary>{contentApp}</Text>
        <Text type={TextType.pre} secondary>{contentSystem}</Text>
    </div>
    <Button size={ButtonSize.Medium} classes="w-full" onClick={onCopyClick}>{localize('actions.copy')}</Button>
</diagnostics-view>
