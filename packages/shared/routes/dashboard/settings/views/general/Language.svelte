<script lang="typescript">
    import { Dropdown, Text } from 'shared/components'
    import { appSettings } from '@core/app'
    import { LanguageChoice, LANGUAGES, localize, setLanguage } from '@core/i18n'
    import { refreshBalanceOverview, updateAccountsBalanceEquiv } from 'shared/lib/wallet'

    let languageList: LanguageChoice[]
    $: languageList = Object.values(LANGUAGES).map((locale) => ({ value: locale, label: locale }))

    const handleLanguage = (item) => {
        setLanguage(item)
        refreshBalanceOverview()
        updateAccountsBalanceEquiv()
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.language.title')}</Text>
<Dropdown sortItems={true} onSelect={handleLanguage} value={LANGUAGES[$appSettings.language]} items={languageList} />
