<script lang="typescript">
    import { Radio, Text, Icon } from 'shared/components'
    import { AppTheme, appSettings, shouldBeDarkMode } from '@core/app'
    import { localize } from '@core/i18n'

    let appTheme: AppTheme = $appSettings.theme

    $: $appSettings.theme = appTheme
    $: $appSettings.darkMode = shouldBeDarkMode($appSettings.theme)
</script>

<div class="flex flex-col">
    <Radio value={'light'} bind:group={appTheme} label={localize('general.lightTheme')} classes="p-2" />
    <Radio value={'dark'} bind:group={appTheme} label={localize('general.darkTheme')} classes="p-2" />
    <Radio value={'system'} bind:group={appTheme} label={localize('general.systemTheme')} classes="p-2" />
    {#if appTheme === 'system'}
        <div class="flex flex-row items-center mb-5">
            <Icon icon="info" classes="mr-3 fill-current text-black dark:text-white" />
            <Text fontSize="14" lineHeight="5">{localize('views.settings.theme.advice')}</Text>
        </div>
    {/if}
</div>
