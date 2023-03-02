<script lang="ts">
    import { Radio } from '@ui'

    import { MarketCurrency } from '@core/market'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile'
    import type { IDropdownChoice } from '@core/utils'

    let currencyList: IDropdownChoice[]
    $: currencyList = Object.values(MarketCurrency)
        .map((currency) => ({ value: currency, label: currency.toUpperCase() }))
        .sort()

    let selectedCurrency: MarketCurrency = $activeProfile?.settings.marketCurrency
    $: selectedCurrency, updateActiveProfileSettings({ marketCurrency: selectedCurrency })
</script>

<div class="flex flex-col overflow-y-auto">
    {#each currencyList as currency}
        <Radio value={currency.value} bind:group={selectedCurrency} label={currency.label} classes="p-2" />
    {/each}
</div>
