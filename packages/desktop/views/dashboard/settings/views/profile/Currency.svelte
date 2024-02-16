<script lang="ts">
    import { localize } from '@core/i18n'
    import { MarketCurrency } from '@core/market'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile'
    import type { IDropdownItem } from '@core/utils'
    import { Dropdown, Text } from '@ui'

    let currencyList: IDropdownItem<MarketCurrency>[]
    $: currencyList = Object.values(MarketCurrency)
        .map((currency) => ({ value: currency, label: currency.toUpperCase() }))
        .sort()

    function onCurrencyChange(item: IDropdownItem<MarketCurrency>): void {
        updateActiveProfileSettings({ marketCurrency: item.value })
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.currency.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.currency.description')}</Text>
<Dropdown
    value={$activeProfile?.settings.marketCurrency}
    items={currencyList}
    sortItems
    onSelect={onCurrencyChange}
    enableTyping
/>
