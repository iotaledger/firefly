<script lang="typescript">
    import { Checkbox, Text } from 'shared/components'
    import { appSettings } from 'shared/lib/appSettings'
    import { Electron } from 'shared/lib/electron'
    import { localize } from 'shared/lib/i18n'

    let deepLinkingChecked = $appSettings.deepLinking

    $: $appSettings.deepLinking = deepLinkingChecked
    $: $appSettings.deepLinking && Electron.DeepLinkManager.checkDeepLinkRequestExists()
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.deepLinks.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.deepLinks.description')}</Text>
<Checkbox label={localize('actions.enableDeepLinks')} bind:checked={deepLinkingChecked} />
