<script lang="typescript">
    import { Checkbox, Text, Icon } from 'shared/components'
    import { appSettings, initAppSettings } from '@core/app'
    import { localize } from '@core/i18n'
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.crashReporting.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.crashReporting.body')}</Text>
<Checkbox label={localize('views.settings.crashReporting.checkbox')} bind:checked={$appSettings.sendCrashReports} />
{#if $appSettings.sendCrashReports !== $initAppSettings.sendCrashReports}
    <div class="flex flex-row items-center mt-4">
        <Icon icon="exclamation" classes="mr-3 fill-current text-black dark:text-white" />
        <Text fontSize="14" lineHeight="5"
            >{localize('views.settings.crashReporting.advice', {
                values: { sendCrashReports: $appSettings.sendCrashReports },
            })}</Text
        >
    </div>
{/if}
