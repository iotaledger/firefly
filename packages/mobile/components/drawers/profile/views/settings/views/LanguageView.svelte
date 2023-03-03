<script lang="ts">
    import { Radio } from '@ui'

    import { appSettings } from '@core/app'
    import { setLanguage, SUPPORTED_LOCALES } from '@core/i18n'

    let appLanguage: string = SUPPORTED_LOCALES[$appSettings.language]

    $: languageList = Object.values(SUPPORTED_LOCALES).map((locale) => ({ value: locale, label: locale }))
    $: appLanguage, setLanguage({ value: appLanguage })
</script>

<language-view class="flex flex-col overflow-y-auto">
    {#each languageList as language}
        <Radio value={language.value} bind:group={appLanguage} label={language.label} classes="p-2" />
    {/each}
</language-view>
