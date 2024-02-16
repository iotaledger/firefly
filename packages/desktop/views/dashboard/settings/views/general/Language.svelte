<script lang="ts">
    import { Dropdown, Text } from '@ui'
    import { appSettings } from '@core/app'
    import { SUPPORTED_LOCALES, localize, setLanguage } from '@core/i18n'
    import type { IDropdownItem } from '@core/utils'

    const languageList: IDropdownItem<string>[] = Object.values(SUPPORTED_LOCALES).map((locale) => ({
        value: locale,
        label: locale,
    }))

    function onLanguageChange(item: IDropdownItem<string>): void {
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
