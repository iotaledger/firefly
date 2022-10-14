<script lang="typescript">
    import { Dropdown, Text } from 'shared/components'
    import { exchangeRates } from 'shared/lib/currency'
    import { localize } from '@core/i18n'
    import { addProfileCurrencyPriceData } from 'shared/lib/market'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile'
    import type { DropdownChoice } from '@core/utils'

    let currencyList: DropdownChoice[]
    $: currencyList = Object.keys($exchangeRates)
        .map((currency) => ({ value: currency, label: currency }))
        .sort()

    function handleCurrencySelect(item): void {
        updateActiveProfileSettings({ currency: item.value })
        void addProfileCurrencyPriceData()
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.currency.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.currency.description')}</Text>
<Dropdown
    sortItems={true}
    onSelect={handleCurrencySelect}
    value={$activeProfile?.settings.currency}
    items={currencyList}
    enableTyping
/>
