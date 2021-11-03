<script lang="typescript">
    import { ButtonRadio, Radio, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { localize } from 'shared/lib/i18n'

    let darkModeEnabled = $appSettings.darkMode

    $: $appSettings.darkMode = darkModeEnabled
</script>

{#if $mobile}
    <ButtonRadio icon="theme-light" value={false} bind:group={darkModeEnabled}>
        {localize('general.lightTheme')}
    </ButtonRadio>
    <ButtonRadio icon="theme-dark" value={true} bind:group={darkModeEnabled}>
        {localize('general.darkTheme')}
    </ButtonRadio>
{:else}
    <Text type="h4" classes="mb-3">{localize('views.settings.theme.title')}</Text>
    <Radio value={false} bind:group={darkModeEnabled} label={localize('general.lightTheme')} />
    <Radio value={true} bind:group={darkModeEnabled} label={localize('general.darkTheme')} />
{/if}
