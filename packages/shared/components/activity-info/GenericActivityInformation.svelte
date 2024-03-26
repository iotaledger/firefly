<script lang="ts">
    import { KeyValueBox } from '@ui'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { activeProfile, getBaseToken } from '@core/profile'
    import { Activity, ActivityDirection, formatTokenAmountBestMatch, formatTokenAmountPrecise } from '@core/wallet'
    import { DEFAULT_MANA, ExplorerEndpoint } from '@core/network'
    import { getOfficialExplorerUrl } from '@core/network/utils'
    import { openUrlInBrowser } from '@core/app'
    import { IKeyValueBoxList, truncateString } from '@core/utils'
    import { setClipboard } from '@core/utils'

    export let activity: Activity

    const explorerUrl = getOfficialExplorerUrl($activeProfile?.network?.id)

    $: expirationTime = getFormattedTimeStamp(activity?.asyncData?.expirationDate)
    $: claimedTime = getFormattedTimeStamp(activity?.asyncData?.claimedDate)
    $: hasStorageDeposit =
        activity?.storageDeposit || (activity?.storageDeposit === 0 && activity?.giftedStorageDeposit === 0)
    // Note: Because this component is used in both confirmation and tx history,
    // we asume the gas budget is the same as the gas fee,
    // its true for transactions made with firefly, but it might not be true for other wallets.
    $: gasFee = activity?.parsedLayer2Metadata?.gasBudget

    $: formattedTransactionTime = getFormattedTimeStamp(activity?.time)
    $: formattedTimelockDate = getFormattedTimeStamp(activity?.asyncData?.timelockDate)
    $: formattedStorageDeposit = formatTokenAmountPrecise(activity?.storageDeposit ?? 0, getBaseToken())
    $: formattedGiftedStorageDeposit = formatTokenAmountPrecise(activity?.giftedStorageDeposit ?? 0, getBaseToken())
    $: formattedSurplus = formatTokenAmountPrecise(activity?.surplus ?? 0, getBaseToken())
    $: formattedGasFee = formatTokenAmountPrecise(Number(gasFee ?? 0), getBaseToken())
    $: formattedManaPrefix = activity.direction === ActivityDirection.Incoming ? '' : '- '
    $: formattedMana = formattedManaPrefix + formatTokenAmountBestMatch(Number(activity?.mana ?? 0), DEFAULT_MANA)

    let transactionDetailsList: IKeyValueBoxList
    $: transactionDetailsList = {
        ...(activity?.destinationNetwork && {
            destinationNetwork: { data: activity?.destinationNetwork },
        }),
        ...(activity?.time && {
            transactionTime: { data: formattedTransactionTime },
        }),
        ...(activity?.tag && {
            tag: { data: activity?.tag, isTooltipVisible: true },
        }),
        ...(activity?.metadata && {
            metadata: { data: activity?.metadata, isTooltipVisible: true },
        }),
        ...(hasStorageDeposit && {
            storageDeposit: { data: formattedStorageDeposit, isTooltipVisible: true },
        }),
        ...(activity?.surplus && {
            surplus: { data: formattedSurplus },
        }),
        ...(activity?.giftedStorageDeposit && {
            giftedStorageDeposit: { data: formattedGiftedStorageDeposit, isTooltipVisible: true },
        }),
        ...(gasFee && {
            gasFee: { data: formattedGasFee, isTooltipVisible: true },
        }),
        ...(expirationTime && {
            expirationTime: { data: expirationTime, isTooltipVisible: true },
        }),
        ...(activity?.asyncData?.timelockDate && {
            timelockDate: { data: formattedTimelockDate, isTooltipVisible: true },
        }),
        ...(claimedTime && { claimedTime: { data: claimedTime } }),
        ...(typeof activity?.mana === 'number' && {
            mana: { data: formattedMana },
        }),
    }

    function onTransactionIdClick(): void {
        explorerUrl
            ? openUrlInBrowser(
                  `${explorerUrl}/${ExplorerEndpoint.Transaction}/${activity?.asyncData?.claimingTransactionId}`
              )
            : setClipboard(activity?.asyncData?.claimingTransactionId)
    }
</script>

{#each Object.entries(transactionDetailsList) as [key, value]}
    <KeyValueBox
        keyText={localize(`general.${key}`)}
        valueText={value.data}
        tooltipText={value.isTooltipVisible
            ? localize(`tooltips.transactionDetails.${activity?.direction}.${key}`)
            : undefined}
    />
{/each}
{#if activity?.asyncData?.claimingTransactionId}
    <KeyValueBox keyText={localize(activity?.asyncData?.isClaiming ? 'general.claimingIn' : 'general.claimedIn')}>
        <button
            slot="value"
            class="action w-fit flex justify-start text-center font-medium text-14 text-blue-500"
            on:click={onTransactionIdClick}
        >
            {truncateString(activity?.asyncData?.claimingTransactionId, 12, 12)}
        </button>
    </KeyValueBox>
{/if}
