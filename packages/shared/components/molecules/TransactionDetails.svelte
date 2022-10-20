<script lang="typescript">
    import {
        TransactionActivityStatusPill,
        ActivityAsyncStatusPill,
        KeyValueBox,
        Pill,
        AmountBox,
        SubjectBox,
    } from 'shared/components'
    import { formatDate, localize } from '@core/i18n'
    import { activeProfile } from '@core/profile'
    import {
        formatTokenAmountDefault,
        formatTokenAmountPrecise,
        ActivityAsyncStatus,
        ActivityType,
        Subject,
        InclusionState,
        ActivityDirection,
        IPersistedAsset,
    } from '@core/wallet'
    import { BASE_TOKEN } from '@core/network'
    import { getOfficialExplorerUrl } from '@core/network/utils'
    import { Platform } from 'shared/lib/platform'
    import { truncateString } from '@lib/helpers'
    import { setClipboard } from '@core/utils'
    import { time } from '@core/app'

    export let asset: IPersistedAsset
    export let asyncStatus: ActivityAsyncStatus = null
    export let claimedDate: Date = null
    export let claimingTransactionId: string = null
    export let direction: ActivityDirection
    export let expirationDate: Date = null
    export let timelockDate: Date = null
    export let formattedFiatValue: string = null
    export let inclusionState: InclusionState = InclusionState.Pending
    export let metadata: string = null
    export let rawAmount: string = null
    export let unit: string
    export let storageDeposit = 0
    export let giftedStorageDeposit = 0
    export let surplus: string = null
    export let subject: Subject = null
    export let tag: string = null
    export let transactionTime: Date = null
    export let isInternal: boolean = false
    export let isClaiming: boolean = false
    export let type: ActivityType

    const explorerUrl = getOfficialExplorerUrl($activeProfile?.networkProtocol, $activeProfile?.networkType)

    $: amount = formatTokenAmountDefault(Number(rawAmount), asset?.metadata, unit)
    $: formattedTransactionTime = getDateFormat(transactionTime)
    $: formattedTimelockDate = getDateFormat(timelockDate)
    $: expirationTime = getDateFormat(expirationDate)
    $: claimedTime = getDateFormat(claimedDate)
    $: isTimelocked = timelockDate > $time
    $: hasStorageDeposit = storageDeposit || (storageDeposit === 0 && giftedStorageDeposit === 0)

    $: formattedStorageDeposit = formatTokenAmountPrecise(
        storageDeposit ?? 0,
        BASE_TOKEN[$activeProfile?.networkProtocol]
    )

    $: formattedGiftedStorageDeposit = formatTokenAmountPrecise(
        giftedStorageDeposit ?? 0,
        BASE_TOKEN[$activeProfile?.networkProtocol]
    )

    $: formattedSurplus = formatTokenAmountPrecise(Number(surplus) ?? 0, BASE_TOKEN[$activeProfile?.networkProtocol])

    $: localePrefix = `tooltips.transactionDetails.${direction}.`

    let detailsList: { [key in string]: { data: string; tooltipText?: string } }
    $: detailsList = {
        ...(transactionTime && {
            transactionTime: { data: formattedTransactionTime },
        }),
        ...(metadata && {
            metadata: {
                data: metadata,
                tooltipText: localize(localePrefix + 'metadata'),
            },
        }),
        ...(tag && {
            tag: {
                data: tag,
                tooltipText: localize(localePrefix + 'tag'),
            },
        }),
        ...(hasStorageDeposit && {
            storageDeposit: {
                data: formattedStorageDeposit,
                tooltipText: localize(localePrefix + 'storageDeposit'),
            },
        }),
        ...(giftedStorageDeposit && {
            giftedStorageDeposit: {
                data: formattedGiftedStorageDeposit,
                tooltipText: localize(localePrefix + 'giftedStorageDeposit'),
            },
        }),
        ...(surplus && {
            surplus: {
                data: formattedSurplus,
                tooltipText: localize(localePrefix + 'surplus'),
            },
        }),
        ...(expirationTime && {
            expirationTime: {
                data: expirationTime,
                tooltipText: localize(localePrefix + 'expirationTime'),
            },
        }),
        ...(timelockDate && {
            timelockDate: {
                data: formattedTimelockDate,
                tooltipText: localize(localePrefix + 'timelockDate'),
            },
        }),
        ...(claimedTime && { claimedTime: { data: claimedTime } }),
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
    <main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-3">
        {#if amount}
            <AmountBox {amount} fiatAmount={formattedFiatValue} {unit} {asset} />
        {/if}
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
    {#if Object.entries(detailsList).length > 0}
        <details-list class="flex flex-col space-y-2">
            {#each Object.entries(detailsList) as [key, value]}
                <KeyValueBox
                    keyText={localize(`general.${key}`)}
                    valueText={value.data}
                    tooltipText={value.tooltipText}
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
