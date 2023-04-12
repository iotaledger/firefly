<script lang="ts">
    import { Radio } from '@ui'

    import { MarketCurrency } from '@core/market'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile'
    import type { IDropdownItem } from '@core/utils'

    let currencyList: IDropdownItem[]
    $: currencyList = Object.values(MarketCurrency)
        .map((currency) => ({ value: currency, label: currency.toUpperCase() }))
        .sort()

    let selectedCurrency: MarketCurrency = $activeProfile?.settings.marketCurrency
    $: selectedCurrency, updateActiveProfileSettings({ marketCurrency: selectedCurrency })
</script>

<currency-view class="flex flex-col overflow-y-auto">
    {#each currencyList as currency}
        <Radio value={currency.value} bind:group={selectedCurrency} label={currency.label} classes="p-2" />
    {/each}
</currency-view>
