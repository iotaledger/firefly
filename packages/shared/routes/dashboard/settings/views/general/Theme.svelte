<script lang="typescript">
    import { Radio, Text, TextHint } from 'shared/components'
    import { appSettings, shouldBeDarkMode } from 'shared/lib/appSettings'
    import { localize } from 'shared/lib/i18n'
    import type { AppTheme } from 'shared/lib/typings/app'

    let appTheme: AppTheme = $appSettings.theme

    $: $appSettings.theme = appTheme
    $: $appSettings.darkMode = shouldBeDarkMode($appSettings.theme)
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.theme.title')}</Text>
<Radio value={'light'} bind:group={appTheme} label={localize('general.lightTheme')} />
<Radio value={'dark'} bind:group={appTheme} label={localize('general.darkTheme')} />
<Radio value={'system'} bind:group={appTheme} label={localize('general.systemTheme')} />
{#if appTheme === 'system'}
<!--    <Text type="p" secondary classes="mb-5">{localize('views.settings.theme.advice')}</Text>-->
    <TextHint classes="mb-5" icon="exclamation" hint={localize('views.settings.theme.advice')}/>
{/if}
