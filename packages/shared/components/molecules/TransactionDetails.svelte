<script lang="typescript">
    import { Pill, ActivityTypePill, Box, AddressBox, KeyValueBox } from 'shared/components/atoms'
    import { Text } from 'shared/components'
    import { convertToFiat, currencies, exchangeRates, formatCurrency } from 'shared/lib/currency'
    import { formatDate, localize } from '@core/i18n'
    import { activeProfile } from 'shared/lib/profile'
    import { CurrencyTypes } from 'shared/lib/typings/currency'
    import { formatUnitBestMatch, formatUnitPrecision } from 'shared/lib/units'
    import { FontWeightText } from 'shared/components/Text.svelte'

    export let timestamp = undefined
    export let type = undefined
    export let value = undefined
    export let address = undefined
    export let account = undefined
    export let unit = undefined

    let date = undefined
    $: {
        try {
            if (timestamp) {
                date = formatDate(new Date(timestamp), {
                    dateStyle: 'long',
                    timeStyle: 'medium',
                })
            }
        } catch {
            date = localize('error.invalidDate')
        }
    }

    $: formattedValue = unit ? formatUnitPrecision(value, unit) : formatUnitBestMatch(value, true, 2)
    $: formattedCurrencyValue = formatCurrency(
        convertToFiat(value, $currencies[CurrencyTypes.USD], $exchangeRates[$activeProfile?.settings.currency])
    )

    let detailsList
    $: detailsList = {
        ...(date && { date }),
    }
</script>

<transaction-details class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-4">
        {#if value || value === 0}
            <transaction-value class="flex flex-col space-y-0.5 items-center">
                <Text type="h1" fontWeight={FontWeightText.semibold}>{formattedValue}</Text>
                <Text fontSize="md" color="gray-600">{formattedCurrencyValue}</Text>
            </transaction-value>
        {/if}
        <transaction-status class="flex flex-row w-full space-x-2 justify-center">
            <ActivityTypePill {type} />
        </transaction-status>
    </main-content>
    {#if account}
        <Box col clearBackground>
            <Text type="p" fontSize="base">{account}</Text>
        </Box>
    {:else if address}
        <AddressBox clearBackground {address} />
    {/if}
    {#if Object.entries(detailsList).length > 0}
        <details-list class="flex flex-col space-y-2">
            {#each Object.entries(detailsList) as [key, value]}
                <KeyValueBox keyText={localize(`general.${key}`)} valueText={value} />
            {/each}
        </details-list>
    {/if}
</transaction-details>
