<script lang="typescript">
    import { Radio } from 'shared/components'
    import { appSettings } from '@core/app'
    import { SUPPORTED_LOCALES, setLanguage } from '@core/i18n'

    export let onLanguageChange: () => unknown = () => {}

    let appLanguage: string = SUPPORTED_LOCALES[$appSettings.language]

    $: languageList = Object.values(SUPPORTED_LOCALES).map((locale) => ({ value: locale, label: locale }))
    $: appLanguage, (setLanguage({ value: appLanguage }), onLanguageChange())
</script>

<div class="flex flex-col overflow-y-auto">
    {#each languageList as language}
        <Radio value={language.value} bind:group={appLanguage} label={language.label} classes="p-2" />
    {/each}
</div>
