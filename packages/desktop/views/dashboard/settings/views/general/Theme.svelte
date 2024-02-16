<script lang="ts">
    import { Radio, Text, Icon } from '@ui'
    import { AppTheme, appSettings, shouldBeDarkMode } from '@core/app'
    import { localize } from '@core/i18n'
    import { Icon as IconEnum } from '@auxiliary/icon'

    let appTheme: AppTheme = $appSettings.theme

    $: $appSettings.theme = appTheme
    $: $appSettings.darkMode = shouldBeDarkMode($appSettings.theme)
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.theme.title')}</Text>
<Radio value={'light'} bind:group={appTheme} label={localize('general.lightTheme')} />
<Radio value={'dark'} bind:group={appTheme} label={localize('general.darkTheme')} />
<Radio value={'system'} bind:group={appTheme} label={localize('general.systemTheme')} />
{#if appTheme === 'system'}
    <div class="flex flex-row items-center mb-5">
        <Icon icon={IconEnum.Info} classes="mr-3 fill-current text-black dark:text-white" />
        <Text fontSize="14" lineHeight="5">{localize('views.settings.theme.advice')}</Text>
    </div>
{/if}
