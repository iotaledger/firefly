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
    import { activeProfile } from '@core/profile'
    import { CurrencyTypes } from 'shared/lib/typings/currency'
    import { FontWeightText } from 'shared/components/Text.svelte'
    import {
        formatTokenAmountPrecise,
        ActivityAsyncStatus,
        ActivityStatus,
        ActivityType,
        Recipient,
    } from '@core/wallet'
    import { BASE_TOKEN } from '@core/network'
    import { truncateString } from '@lib/helpers'

    export let amount: string
    export let rawAmount: number

    export let type: ActivityType
    export let status: ActivityStatus
    export let asyncStatus: ActivityAsyncStatus
    export let account: string
    export let address: string
    export let time: Date
    export let publicNote: string
    export let storageDeposit = 0
    export let expireDate: Date
    export let recipient: Recipient

    let transactionTime: string
    $: {
        try {
            if (time) {
                transactionTime = formatDate(time, {
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
            if (expireDate) {
                transactionTime = formatDate(expireDate, {
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

    $: formattedCurrencyValue = formatCurrency(
        convertToFiat(rawAmount, $currencies[CurrencyTypes.USD], $exchangeRates[$activeProfile?.settings?.currency])
    )
    $: formattedStorageDeposit = formatTokenAmountPrecise(
        storageDeposit ?? 0,
        BASE_TOKEN[$activeProfile?.networkProtocol]
    )

    $: detailsList = {
        ...(transactionTime && { transactionTime }),
        ...(publicNote && { publicNote }),
        ...((storageDeposit || storageDeposit === 0) && { storageDeposit: formattedStorageDeposit }),
        ...(expirationTime && { expirationTime }),
    }
</script>

<transaction-details class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-4">
        {#if amount}
            <transaction-value class="flex flex-col space-y-0.5 items-center">
                <Text type="h1" fontWeight={FontWeightText.semibold}>{amount ?? 0}</Text>
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
                <AccountLabel {account} />
            </Box>
        {:else if address}
            <AddressBox clearBackground clearPadding isCopyable address={truncateString(address, 6, 6)} />
        {/if}

        {#if recipient.type === 'account'}
            <Box row clearBackground clearPadding classes="justify-center">
                <AccountLabel account={recipient.account} />
            </Box>
        {:else if recipient.type === 'address'}
            <AddressBox clearBackground clearPadding isCopyable address={truncateString(recipient.address, 6, 6)} />
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
