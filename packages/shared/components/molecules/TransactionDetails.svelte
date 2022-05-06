<script lang="typescript">
    import {
        ActivityStatusPill,
        ActivityAsyncStatusPill,
        Box,
        AddressBox,
        KeyValueBox,
        AccountLabel,
    } from 'shared/components/atoms'
    import { Text } from 'shared/components'
    import { convertToFiat, currencies, exchangeRates, formatCurrency } from 'shared/lib/currency'
    import { formatDate, localize } from '@core/i18n'
    import { activeProfile } from 'shared/lib/profile'
    import { CurrencyTypes } from 'shared/lib/typings/currency'
    import { formatUnitBestMatch, formatUnitPrecision } from 'shared/lib/units'
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { Unit } from '@iota/unit-converter/'
    import { ActivityAsyncStatus, ActivityStatus, ActivityType } from '@lib/typings/activity'
    import { WalletAccount } from '@lib/typings/wallet'

    export let value: number
    export let unit: Unit
    export let type: ActivityType
    export let status: ActivityStatus
    export let asyncStatus: ActivityAsyncStatus
    export let address: string
    export let account: WalletAccount
    export let timestamp: number
    export let publicNote: string
    export let storageDeposit = 0
    export let expirationTimestamp: number

    let transactionTime: string
    $: {
        try {
            if (timestamp) {
                transactionTime = formatDate(new Date(timestamp), {
                    dateStyle: 'long',
                    timeStyle: 'medium',
                })
            }
        } catch {
            transactionTime = localize('error.invalidDate')
        }
    }

    let expirationTime: string
    $: {
        try {
            if (expirationTimestamp) {
                transactionTime = formatDate(new Date(expirationTimestamp), {
                    dateStyle: 'long',
                    timeStyle: 'medium',
                })
            } else {
                expirationTime = undefined
            }
        } catch {
            expirationTime = undefined
        }
    }

    $: formattedValue = unit ? formatUnitPrecision(value, unit) : formatUnitBestMatch(value, true, 2)
    $: formattedCurrencyValue = formatCurrency(
        convertToFiat(value, $currencies[CurrencyTypes.USD], $exchangeRates[$activeProfile?.settings.currency])
    )
    $: formattedStorageDeposit = storageDeposit || storageDeposit === 0 ? storageDeposit + ' i' : ''

    $: detailsList = {
        ...(transactionTime && { transactionTime }),
        ...(publicNote && { publicNote }),
        ...((storageDeposit || storageDeposit === 0) && { storageDeposit: formattedStorageDeposit }),
        ...(expirationTime && { expirationTime }),
    }
</script>

<transaction-details class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-4">
        {#if value || value === 0}
            <transaction-value class="flex flex-col space-y-0.5 items-center">
                <Text type="h1" fontWeight={FontWeightText.semibold}>{formattedValue}</Text>
                <Text fontSize="md" color="gray-600" darkColor="gray-500">{formattedCurrencyValue}</Text>
            </transaction-value>
        {/if}
        <transaction-status class="flex flex-row w-full space-x-2 justify-center">
            {#if status}
                <ActivityStatusPill {type} {status} />
            {/if}
            {#if asyncStatus}
                <ActivityAsyncStatusPill {asyncStatus} />
            {/if}
        </transaction-status>
        {#if account}
            <Box row clearBackground clearPadding classes="justify-center">
                <AccountLabel profile={$activeProfile} {account} />
            </Box>
        {:else if address}
            <AddressBox clearBackground clearPadding isCopyable {address} />
        {/if}
    </main-content>
    {#if Object.entries(detailsList).length > 0}
        <details-list class="flex flex-col space-y-2">
            {#each Object.entries(detailsList) as [key, value]}
                <KeyValueBox keyText={localize(`general.${key}`)} valueText={value} />
            {/each}
        </details-list>
    {/if}
</transaction-details>
