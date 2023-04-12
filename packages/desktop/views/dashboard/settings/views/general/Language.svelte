<script lang="ts">
    import { Dropdown, Text } from 'shared/components'
    import { appSettings } from '@core/app'
    import { SUPPORTED_LOCALES, localize, setLanguage } from '@core/i18n'
    import type { IDropdownChoice } from '@core/utils'

    const languageList: IDropdownChoice<string>[] = Object.values(SUPPORTED_LOCALES).map((locale) => ({
        value: locale,
        label: locale,
    }))

    function onLanguageChange(item: IDropdownChoice<string>): void {
        setLanguage(item)
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.language.title')}</Text>
<Dropdown
    value={SUPPORTED_LOCALES[$appSettings.language]}
    items={languageList}
    sortItems={true}
    onSelect={onLanguageChange}
    enableTyping
/>
