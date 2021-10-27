<script lang="typescript">
    import { ButtonRadio, Radio, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import type { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    let darkModeEnabled = $appSettings.darkMode

    $: $appSettings.darkMode = darkModeEnabled
</script>

<section id="theme" class="w-full md:w-3/4">
    {#if $mobile}
        <ButtonRadio icon="theme-light" value={false} bind:group={darkModeEnabled}>
            {locale('general.lightTheme')}
        </ButtonRadio>
        <ButtonRadio icon="theme-dark" value={true} bind:group={darkModeEnabled}>
            {locale('general.darkTheme')}
        </ButtonRadio>
    {:else}
        <Text type="h4" classes="mb-3">{locale('views.settings.theme.title')}</Text>
        <Radio value={false} bind:group={darkModeEnabled} label={locale('general.lightTheme')} />
        <Radio value={true} bind:group={darkModeEnabled} label={locale('general.darkTheme')} />
    {/if}
</section>
