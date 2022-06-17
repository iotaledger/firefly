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
        Subject,
        InclusionState,
        ActivityDirection,
    } from '@core/wallet'
    import { BASE_TOKEN } from '@core/network'
    import { getOfficialExplorerUrl } from '@core/network/utils'
    import { Platform } from 'shared/lib/platform'
    import { truncateString } from '@lib/helpers'
    import { setClipboard } from '@lib/utils'

    export let amount: string
    export let unit: string
    export let type: ActivityType
    export let direction: ActivityDirection
    export let inclusionState: InclusionState = InclusionState.Pending
    export let asyncStatus: ActivityAsyncStatus = undefined
    export let formattedFiatValue: string
    export let time: Date
    export let metadata: string
    export let tag: string
    export let storageDeposit = 0
    export let expirationDate: Date
    export let subject: Subject
    export let claimedTransactionId: string
    export let claimedDate: Date

    const explorerUrl = getOfficialExplorerUrl($activeProfile?.networkProtocol, $activeProfile?.networkType)

    $: transactionTime = getDateFormat(time)
    $: expirationTime = getDateFormat(expirationDate)
    $: claimedTime = getDateFormat(claimedDate)

    $: formattedStorageDeposit = formatTokenAmountPrecise(
        storageDeposit ?? 0,
        BASE_TOKEN[$activeProfile?.networkProtocol]
    )

    $: detailsList = {
        ...(transactionTime && { transactionTime }),
        ...(metadata && { metadata }),
        ...(tag && { tag }),
        ...((storageDeposit || storageDeposit === 0) && { storageDeposit: formattedStorageDeposit }),
        ...(expirationTime && { expirationTime }),
        ...(claimedTime && { claimedTime }),
    }

    function getDateFormat(date: Date): string {
        try {
            if (date) {
                return formatDate(date, {
                    dateStyle: 'long',
                    timeStyle: 'medium',
                })
            } else {
                return undefined
            }
        } catch {
            return undefined
        }
    }

    function handleTransactionIdClick(): void {
        explorerUrl
            ? Platform.openUrl(`${explorerUrl}/block/${claimedTransactionId}`)
            : setClipboard(claimedTransactionId)
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
                <ActivityStatusPill {type} {direction} {inclusionState} />
            {/if}
            {#if asyncStatus}
                <ActivityAsyncStatusPill {asyncStatus} />
            {/if}
        </transaction-status>
        {#if subject?.type === 'account'}
            <Box row clearBackground clearPadding classes="justify-center">
                <AccountLabel account={subject.account} />
            </Box>
        {:else if subject?.type === 'address'}
            <AddressBox clearBackground clearPadding isCopyable address={subject?.address} />
        {:else}
            <Box col clearBackground clearPadding>
                <Text type="pre" fontSize="base" fontWeight={FontWeightText.medium}>
                    {localize('general.unknownAddress')}
                </Text>
            </Box>
        {/if}
    </main-content>
    {#if Object.entries(detailsList).length > 0}
        <details-list class="flex flex-col space-y-2">
            {#each Object.entries(detailsList) as [key, value]}
                <KeyValueBox keyText={localize(`general.${key}`)} valueText={value} />
            {/each}
            {#if claimedTransactionId}
                <KeyValueBox keyText={localize('general.claimedTransactionId')}>
                    <button
                        slot="value"
                        class="action w-fit flex justify-start text-center font-medium text-14 text-blue-500"
                        on:click={handleTransactionIdClick}
                    >
                        {truncateString(claimedTransactionId, 12, 12)}
                    </button>
                </KeyValueBox>
            {/if}
        </details-list>
    {/if}
</transaction-details>
