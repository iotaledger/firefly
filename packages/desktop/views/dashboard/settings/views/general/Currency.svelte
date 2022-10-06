<script lang="typescript">
    import { localize } from '@core/i18n'
    import { MarketCurrency } from '@core/market'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile'
    import type { IDropdownChoice } from '@core/utils'
    import { Dropdown, Text } from 'shared/components'

    let currencyList: IDropdownChoice[]
    $: currencyList = Object.values(MarketCurrency)
        .map((currency) => ({ value: currency, label: currency.toUpperCase() }))
        .sort()

    const handleCurrencySelect = (item) => {
        updateActiveProfileSettings({ marketCurrency: item.value })
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.currency.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.currency.description')}</Text>
<Dropdown
    sortItems={true}
    onSelect={handleCurrencySelect}
    value={$activeProfile?.settings.marketCurrency}
    items={currencyList}
    enableTyping
/>
