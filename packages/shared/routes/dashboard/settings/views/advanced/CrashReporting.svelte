<script lang="typescript">
    import { Checkbox, Text } from 'shared/components'
    import { appSettings } from 'shared/lib/appSettings'
    import { localize } from 'shared/lib/i18n'
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.crashReporting.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.crashReporting.body')}</Text>
<Checkbox label={localize('views.settings.crashReporting.checkbox')} bind:checked={$appSettings.sendCrashReports} />
