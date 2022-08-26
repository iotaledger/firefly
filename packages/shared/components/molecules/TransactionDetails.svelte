<script lang="typescript">
    import {
        ActivityStatusPill,
        ActivityAsyncStatusPill,
        Box,
        AddressBox,
        KeyValueBox,
        AccountLabel,
    } from 'shared/components/atoms'
    import { AssetIcon, Text } from 'shared/components'
    import { formatDate, localize } from '@core/i18n'
    import { activeProfile } from '@core/profile'
    import { FontWeight } from 'shared/components/Text.svelte'
    import {
        formatTokenAmountPrecise,
        ActivityAsyncStatus,
        ActivityType,
        Subject,
        InclusionState,
        ActivityDirection,
        IAsset,
    } from '@core/wallet'
    import { BASE_TOKEN } from '@core/network'
    import { getOfficialExplorerUrl } from '@core/network/utils'
    import { Platform } from 'shared/lib/platform'
    import { truncateString } from '@lib/helpers'
    import { setClipboard } from '@lib/utils'

    export let asset: IAsset
    export let asyncStatus: ActivityAsyncStatus = null
    export let claimedDate: Date = null
    export let claimingTransactionId: string = null
    export let isClaiming: boolean = null
    export let direction: ActivityDirection
    export let expirationDate: Date = null
    export let formattedFiatValue: string = null
    export let inclusionState: InclusionState = InclusionState.Pending
    export let metadata: string = null
    export let amount: string = null
    export let unit: string
    export let storageDeposit = 0
    export let giftedStorageDeposit = 0
    export let subject: Subject = null
    export let tag: string = null
    export let time: Date = null
    export let isInternal: boolean = false
    export let type: ActivityType

    const explorerUrl = getOfficialExplorerUrl($activeProfile?.networkProtocol, $activeProfile?.networkType)

    $: transactionTime = getDateFormat(time)
    $: expirationTime = getDateFormat(expirationDate)
    $: claimedTime = getDateFormat(claimedDate)

    $: formattedStorageDeposit = formatTokenAmountPrecise(
        storageDeposit ?? 0,
        BASE_TOKEN[$activeProfile?.networkProtocol]
    )

    $: formattedGiftedStorageDeposit = formatTokenAmountPrecise(
        giftedStorageDeposit ?? 0,
        BASE_TOKEN[$activeProfile?.networkProtocol]
    )

    $: detailsList = {
        ...(transactionTime && { transactionTime }),
        ...(metadata && { metadata }),
        ...(tag && { tag }),
        ...((storageDeposit || (storageDeposit === 0 && giftedStorageDeposit === 0)) && {
            storageDeposit: formattedStorageDeposit,
        }),
        ...(giftedStorageDeposit && { giftedStorageDeposit: formattedGiftedStorageDeposit }),
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
            ? Platform.openUrl(`${explorerUrl}/block/${claimingTransactionId}`)
            : setClipboard(claimingTransactionId)
    }
</script>

<transaction-details class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-4">
        {#if amount}
            <transaction-value class="flex flex-col space-y-0.5 items-center">
                <div class="flex flex-row space-x-3">
                    <AssetIcon {asset} />
                    <div class="flex flex-row items-baseline space-x-0.1">
                        <Text type="h1" fontWeight={FontWeight.semibold}>
                            {amount}
                        </Text>
                        {#if unit}
                            <Text type="h4" classes="ml-1" fontWeight={FontWeight.medium}>{unit}</Text>
                        {/if}
                    </div>
                </div>
                {#if formattedFiatValue}
                    <Text fontSize="md" color="gray-600" darkColor="gray-500">{formattedFiatValue}</Text>
                {/if}
            </transaction-value>
        {/if}
        <transaction-status class="flex flex-row w-full space-x-2 justify-center">
            {#if inclusionState}
                <ActivityStatusPill {type} {direction} {isInternal} {inclusionState} />
            {/if}
            {#if asyncStatus}
                <ActivityAsyncStatusPill {asyncStatus} />
            {/if}
        </transaction-status>
        {#if type === ActivityType.Transaction}
            {#if subject?.type === 'account'}
                <Box row clearBackground clearPadding classes="justify-center">
                    <AccountLabel account={subject.account} />
                </Box>
            {:else if subject?.type === 'address'}
                <AddressBox clearBackground clearPadding isCopyable address={subject?.address} />
            {:else}
                <Box col clearBackground clearPadding>
                    <Text type="pre" fontSize="base" fontWeight={FontWeight.medium}>
                        {localize('general.unknownAddress')}
                    </Text>
                </Box>
            {/if}
        {/if}
    </main-content>
    {#if Object.entries(detailsList).length > 0}
        <details-list class="flex flex-col space-y-2">
            {#each Object.entries(detailsList) as [key, value]}
                <KeyValueBox keyText={localize(`general.${key}`)} valueText={value} />
            {/each}
            {#if claimingTransactionId}
                <KeyValueBox keyText={localize(isClaiming ? 'general.claimingIn' : 'general.claimedIn')}>
                    <button
                        slot="value"
                        class="action w-fit flex justify-start text-center font-medium text-14 text-blue-500"
                        on:click={handleTransactionIdClick}
                    >
                        {truncateString(claimingTransactionId, 12, 12)}
                    </button>
                </KeyValueBox>
            {/if}
        </details-list>
    {/if}
</transaction-details>
