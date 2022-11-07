<script lang="typescript">
    import {
        TransactionActivityStatusPill,
        ActivityAsyncStatusPill,
        KeyValueBox,
        Pill,
        Icon,
        SubjectBox,
    } from 'shared/components'
    import { formatDate, localize } from '@core/i18n'
    import { activeProfile } from '@core/profile'
    import {
        formatTokenAmountPrecise,
        ActivityAsyncStatus,
        ActivityType,
        Subject,
        InclusionState,
        ActivityDirection,
    } from '@core/wallet'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'
    import { BASE_TOKEN } from '@core/network'
    import { getOfficialExplorerUrl } from '@core/network/utils'
    import { Platform } from 'shared/lib/platform'
    import { truncateString } from '@core/utils'
    import { setClipboard } from '@core/utils'
    import { time } from '@core/app'
    import { IIrc27Metadata } from '@core/nfts'

    export let nftId: string = ''
    export let nftMetadata: IIrc27Metadata
    export let metadata: string = null
    export let tag: string = null
    export let asyncStatus: ActivityAsyncStatus = null
    export let claimedDate: Date = null
    export let claimingTransactionId: string = null
    export let direction: ActivityDirection = ActivityDirection.Incoming
    export let expirationDate: Date = null
    export let timelockDate: Date = null
    export let inclusionState: InclusionState = InclusionState.Pending
    export let storageDeposit = 0
    export let giftedStorageDeposit = 0
    export let subject: Subject = null
    export let transactionTime: Date = null
    export let isInternal: boolean = false
    export let isClaiming: boolean = false
    export let type: ActivityType

    const explorerUrl = getOfficialExplorerUrl($activeProfile?.networkProtocol, $activeProfile?.networkType)

    $: expirationTime = getDateFormat(expirationDate)
    $: claimedTime = getDateFormat(claimedDate)
    $: isTimelocked = timelockDate > $time
    $: hasStorageDeposit = storageDeposit || (storageDeposit === 0 && giftedStorageDeposit === 0)

    $: formattedTransactionTime = getDateFormat(transactionTime)
    $: formattedTimelockDate = getDateFormat(timelockDate)
    $: formattedStorageDeposit = formatTokenAmountPrecise(
        storageDeposit ?? 0,
        BASE_TOKEN[$activeProfile?.networkProtocol]
    )
    $: formattedGiftedStorageDeposit = formatTokenAmountPrecise(
        giftedStorageDeposit ?? 0,
        BASE_TOKEN[$activeProfile?.networkProtocol]
    )

    let transactionDetailsList: { [key in string]: { data: string; isTooltipVisible?: boolean } }
    $: transactionDetailsList = {
        ...(transactionTime && {
            transactionTime: { data: formattedTransactionTime },
        }),
        ...(nftId && { nftId: { data: nftId, copyable: true } }),
        ...(metadata && {
            metadata: { data: metadata, isTooltipVisible: true },
        }),
        ...(tag && {
            tag: { data: tag, isTooltipVisible: true },
        }),
        ...(hasStorageDeposit && {
            storageDeposit: { data: formattedStorageDeposit, isTooltipVisible: true },
        }),
        ...(giftedStorageDeposit && {
            giftedStorageDeposit: { data: formattedGiftedStorageDeposit, isTooltipVisible: true },
        }),
        ...(expirationTime && {
            expirationTime: { data: expirationTime, isTooltipVisible: true },
        }),
        ...(timelockDate && {
            timelockDate: { data: formattedTimelockDate, isTooltipVisible: true },
        }),
        ...(claimedTime && { claimedTime: { data: claimedTime } }),
    }

    let nftMetadataDetailsList: {
        [key in keyof typeof nftMetadata]: { data: unknown; isTooltipVisible?: boolean; isCopyable?: boolean }
    }
    $: nftMetadataDetailsList = {
        ...(nftMetadata?.standard && {
            standard: { data: nftMetadata.standard, isTooltipVisible: true },
        }),
        ...(nftMetadata?.version && {
            version: { data: nftMetadata.version },
        }),
        ...(nftMetadata?.name && {
            name: { data: nftMetadata.name },
        }),
        ...(nftMetadata?.type && {
            type: { data: nftMetadata.type as string, isTooltipVisible: true },
        }),
        ...(nftMetadata?.uri && {
            uri: { data: nftMetadata.uri, isCopyable: true },
        }),
        ...(nftMetadata?.collectionId && {
            collectionId: { data: nftMetadata.collectionId, isTooltipVisible: true },
        }),
        ...(nftMetadata?.collectionName && {
            collectionName: { data: nftMetadata.collectionName },
        }),
        ...(nftMetadata?.royalties && {
            royalties: { data: nftMetadata.royalties, isTooltipVisible: true },
        }),
        ...(nftMetadata?.issuerName && {
            issuerName: { data: nftMetadata.issuerName, isTooltipVisible: true },
        }),
        ...(nftMetadata?.description && {
            description: { data: nftMetadata.description },
        }),
        ...(nftMetadata?.attributes && {
            attributes: { data: nftMetadata.attributes, isTooltipVisible: true },
        }),
    }

    function handleTransactionIdClick(): void {
        explorerUrl
            ? Platform.openUrl(`${explorerUrl}/block/${claimingTransactionId}`)
            : setClipboard(claimingTransactionId)
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
        } catch (error) {
            return undefined
        }
    }
</script>

<transaction-details class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <div class="flex w-full items-center justify-center">
        <div class="rounded-full flex justify-center items-center transition-none p-2 w-16 h-16 bg-gray-500">
            <Icon
                icon={IconEnum.Collectibles}
                width="100%"
                height="100%"
                classes="text-white dark:text-gray-800 text-center"
            />
        </div>
    </div>
    <main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-3">
        <transaction-status class="flex flex-row w-full space-x-2 justify-center">
            {#if inclusionState && direction}
                <TransactionActivityStatusPill {type} {direction} {isInternal} {inclusionState} />
            {/if}
            {#if asyncStatus}
                <ActivityAsyncStatusPill {asyncStatus} />
            {/if}
            {#if isTimelocked}
                <Pill backgroundColor="gray-200" darkBackgroundColor="gray-200">
                    {localize('pills.locked')}
                </Pill>
            {/if}
        </transaction-status>
        {#if subject}
            <SubjectBox {subject} />
        {/if}
    </main-content>
    {#if Object.entries(transactionDetailsList).length > 0}
        <details-list class="flex flex-col space-y-2">
            {#each Object.entries(transactionDetailsList) as [key, value]}
                <KeyValueBox
                    keyText={localize(`general.${key}`)}
                    valueText={value.data}
                    tooltipText={value.isTooltipVisible
                        ? localize(`tooltips.transactionDetails.${direction}.${key}`)
                        : undefined}
                />
            {/each}
            {#each Object.entries(nftMetadataDetailsList) as [key, value]}
                <KeyValueBox
                    keyText={localize(`views.collectibles.metadata.${key}`)}
                    valueText={value.data}
                    tooltipText={value.isTooltipVisible
                        ? localize(`tooltips.transactionDetails.nftMetadata.${key}`)
                        : undefined}
                    isCopyable={value.isCopyable}
                />
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
