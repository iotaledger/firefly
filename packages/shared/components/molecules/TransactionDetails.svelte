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
    import { formatDate, localize } from '@core/i18n'
    import { activeProfile } from '@core/profile'
    import { FontWeightText } from 'shared/components/Text.svelte'
    import {
        formatTokenAmountPrecise,
        ActivityAsyncStatus,
        ActivityType,
        Recipient,
        InclusionState,
    } from '@core/wallet'
    import { BASE_TOKEN } from '@core/network'

    export let amount: string
    export let unit: string
    export let type: ActivityType
    export let inclusionState: InclusionState
    export let asyncStatus: ActivityAsyncStatus
    export let formattedFiatValue: string
    export let time: Date
    export let publicNote: string
    export let storageDeposit = 0
    export let expirationDate: Date
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
            if (expirationDate) {
                expirationTime = formatDate(expirationDate, {
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
                <div class="flex flex-row items-baseline space-x-0.5">
                    <Text type="h1" fontWeight={FontWeightText.semibold}>{amount}</Text>
                    <Text type="h4" classes="ml-1" fontWeight={FontWeightText.medium}>{unit}</Text>
                </div>
                {#if formattedFiatValue}
                    <Text fontSize="md" color="gray-600" darkColor="gray-500">{formattedFiatValue}</Text>
                {/if}
            </transaction-value>
        {/if}
        <transaction-status class="flex flex-row w-full space-x-2 justify-center">
            {#if inclusionState}
                <ActivityStatusPill {type} {inclusionState} />
            {/if}
            {#if asyncStatus}
                <ActivityAsyncStatusPill {asyncStatus} />
            {/if}
        </transaction-status>
        {#if recipient.type === 'account'}
            <Box row clearBackground clearPadding classes="justify-center">
                <AccountLabel account={recipient.account} />
            </Box>
        {:else if recipient.type === 'address'}
            <AddressBox clearBackground clearPadding isCopyable address={recipient.address} />
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
