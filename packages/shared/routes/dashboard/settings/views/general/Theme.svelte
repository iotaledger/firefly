<script lang="typescript">
    import { ButtonRadio, Radio, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { appSettings, AppTheme, shouldBeDarkMode } from 'shared/lib/appSettings'
    import { localize } from 'shared/lib/i18n'

    let appTheme: AppTheme = $appSettings.theme

    $: $appSettings.theme = appTheme
    $: $appSettings.darkMode = shouldBeDarkMode($appSettings.theme)
</script>

{#if $mobile}
    <ButtonRadio icon="theme-light" value={'light'} bind:group={appTheme}>{localize('general.lightTheme')}</ButtonRadio>
    <ButtonRadio icon="theme-dark" value={'dark'} bind:group={appTheme}>{localize('general.darkTheme')}</ButtonRadio>
    <ButtonRadio icon="theme-dark" value={'system'} bind:group={appTheme}>
        {localize('general.systemTheme')}
    </ButtonRadio>
{:else}
    <Text type="h4" classes="mb-3">{localize('views.settings.theme.title')}</Text>
    <Radio value={'light'} bind:group={appTheme} label={localize('general.lightTheme')} />
    <Radio value={'dark'} bind:group={appTheme} label={localize('general.darkTheme')} />
    <Radio value={'system'} bind:group={appTheme} label={localize('general.systemTheme')} />
{/if}
{#if appTheme === 'system'}
    <Text type="p" secondary classes="mb-5">{localize('views.settings.theme.advice')}</Text>
{/if}
