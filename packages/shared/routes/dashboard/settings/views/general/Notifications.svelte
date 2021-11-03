<script lang="typescript">
    import { Checkbox, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { localize } from 'shared/lib/i18n'

    let notificationsChecked = $appSettings.notifications

    $: $appSettings.notifications = notificationsChecked
</script>

<style type="text/scss">
    button {
        &.active {
            @apply bg-blue-500;
            @apply bg-opacity-10;
            :global(p) {
                @apply text-blue-500;
            }
        }
    }
</style>

{#if !$mobile}
    <Text type="h4" classes="mb-3">{localize('views.settings.notifications.title')}</Text>
{/if}
<Text type="p" secondary classes="mb-5">{localize('views.settings.notifications.description')}</Text>
<Checkbox label={localize('actions.enableSystemNotifications')} bind:checked={notificationsChecked} />
