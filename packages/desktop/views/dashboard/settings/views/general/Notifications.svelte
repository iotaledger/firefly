<script lang="ts">
    import { Checkbox, Text } from '@ui'
    import { appSettings } from '@core/app'
    import { localize } from '@core/i18n'

    let notificationsChecked = $appSettings.notifications

    $: $appSettings.notifications = notificationsChecked
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.notifications.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.notifications.description')}</Text>
<Checkbox label={localize('actions.enableSystemNotifications')} bind:checked={notificationsChecked} />
