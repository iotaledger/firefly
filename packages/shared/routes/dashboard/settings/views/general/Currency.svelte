<script lang="typescript">
    import { Dropdown, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { exchangeRates } from 'shared/lib/currency'
    import { localize } from '@core/i18n'
    import { addProfileCurrencyPriceData } from 'shared/lib/market'
    import { activeProfile, updateProfile } from 'shared/lib/profile'
    import { refreshBalanceOverview, updateAccountsBalanceEquiv } from 'shared/lib/wallet'

    $: currencyList = Object.keys($exchangeRates)
        .map((currency) => ({ value: currency, label: currency }))
        .sort((a, b) => a.label.localeCompare(b.label))

    const handleCurrencySelect = (item) => {
        updateProfile('settings.currency', item.value)
        void addProfileCurrencyPriceData()
        refreshBalanceOverview()
        updateAccountsBalanceEquiv()
    }
</script>

{#if $mobile}
    <div class="flex flex-col flex-wrap space-y-2 overflow-y-auto">
        {#each currencyList as currency}
            <button
                class="relative flex items-center p-2 w-full whitespace-nowrap rounded-md"
                on:click={() => handleCurrencySelect(currency)}
                class:active={currency?.label === $activeProfile?.settings.currency}
            >
                <Text type="p" smaller>{currency?.label}</Text>
            </button>
        {/each}
    </div>
{:else}
    <Text type="h4" classes="mb-3">{localize('views.settings.currency.title')}</Text>
    <Text type="p" secondary classes="mb-5">{localize('views.settings.currency.description')}</Text>
    <Dropdown
        sortItems={true}
        onSelect={handleCurrencySelect}
        value={$activeProfile?.settings.currency}
        items={currencyList}
    />
{/if}

<style type="text/scss">
    button {
        &.active {
            @apply bg-blue-500;
            @apply bg-opacity-10;
            :global(p) {
                @apply text-blue-500;
            }
        }
    }
</style>
