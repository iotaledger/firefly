<script lang="ts">
    import { Checkbox, Text } from '@ui'
    import { appSettings } from '@core/app'
    import { localize } from '@core/i18n'
    import { Platform } from '@core/app'

    let deepLinkingChecked = $appSettings.deepLinking

    $: $appSettings.deepLinking = deepLinkingChecked
    $: $appSettings.deepLinking && Platform.DeepLinkManager.checkDeepLinkRequestExists()
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.deepLinks.title')}</Text>
<Text type="p" secondary classes="mb-5"
    >{localize('views.settings.deepLinks.description', { values: { appProtocol: process.env.APP_PROTOCOL } })}</Text
>
<Checkbox label={localize('actions.enableDeepLinks')} bind:checked={deepLinkingChecked} />
