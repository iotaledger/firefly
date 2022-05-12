<script lang="typescript">
    import { Dropdown, Text } from 'shared/components'
    import { exchangeRates } from 'shared/lib/currency'
    import { localize } from '@core/i18n'
    import { addProfileCurrencyPriceData } from 'shared/lib/market'
    import { refreshBalanceOverview, updateAccountsBalanceEquiv } from 'shared/lib/wallet'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile'

    $: currencyList = Object.keys($exchangeRates)
        .map((currency) => ({ value: currency, label: currency }))
        .sort()

    const handleCurrencySelect = (item) => {
        updateActiveProfileSettings({ currency: item.value })
        void addProfileCurrencyPriceData()
        refreshBalanceOverview()
        updateAccountsBalanceEquiv()
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.currency.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.currency.description')}</Text>
<Dropdown
    sortItems={true}
    onSelect={handleCurrencySelect}
    value={$activeProfile?.settings.currency}
    items={currencyList}
/>
