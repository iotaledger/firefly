<script lang="typescript">
    import { KeyValueBox } from 'shared/components'
    import { formatDate, localize } from '@core/i18n'
    import { activeProfile } from '@core/profile'
    import { formatTokenAmountPrecise, BaseActivity } from '@core/wallet'
    import { BASE_TOKEN } from '@core/network'
    import { getOfficialExplorerUrl } from '@core/network/utils'
    import { Platform } from '@core/app'
    import { truncateString } from '@core/utils'
    import { setClipboard } from '@core/utils'

    export let activity: BaseActivity

    const explorerUrl = getOfficialExplorerUrl($activeProfile?.networkProtocol, $activeProfile?.networkType)

    $: expirationTime = getDateFormat(activity.asyncData?.expirationDate)
    $: claimedTime = getDateFormat(activity.asyncData?.claimedDate)
    $: hasStorageDeposit =
        activity.storageDeposit || (activity.storageDeposit === 0 && activity.giftedStorageDeposit === 0)

    $: formattedTransactionTime = getDateFormat(activity.time)
    $: formattedTimelockDate = getDateFormat(activity.asyncData?.timelockDate)
    $: formattedStorageDeposit = formatTokenAmountPrecise(
        activity.storageDeposit ?? 0,
        BASE_TOKEN[$activeProfile?.networkProtocol]
    )
    $: formattedGiftedStorageDeposit = formatTokenAmountPrecise(
        activity.giftedStorageDeposit ?? 0,
        BASE_TOKEN[$activeProfile?.networkProtocol]
    )

    let transactionDetailsList: { [key in string]: { data: string; isTooltipVisible?: boolean } }
    $: transactionDetailsList = {
        ...(activity.time && {
            transactionTime: { data: formattedTransactionTime },
        }),
        ...(activity.metadata && {
            metadata: { data: activity.metadata, isTooltipVisible: true },
        }),
        ...(activity.tag && {
            tag: { data: activity.tag, isTooltipVisible: true },
        }),
        ...(hasStorageDeposit && {
            storageDeposit: { data: formattedStorageDeposit, isTooltipVisible: true },
        }),
        ...(activity.giftedStorageDeposit && {
            giftedStorageDeposit: { data: formattedGiftedStorageDeposit, isTooltipVisible: true },
        }),
        ...(expirationTime && {
            expirationTime: { data: expirationTime, isTooltipVisible: true },
        }),
        ...(activity.asyncData?.timelockDate && {
            timelockDate: { data: formattedTimelockDate, isTooltipVisible: true },
        }),
        ...(claimedTime && { claimedTime: { data: claimedTime } }),
    }

    function handleTransactionIdClick(): void {
        explorerUrl
            ? Platform.openUrl(`${explorerUrl}/block/${activity.asyncData?.claimingTransactionId}`)
            : setClipboard(activity.asyncData?.claimingTransactionId)
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
        } catch (err) {
            return undefined
        }
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
{#if activity.asyncData?.claimingTransactionId}
    <KeyValueBox keyText={localize(activity.asyncData?.isClaiming ? 'general.claimingIn' : 'general.claimedIn')}>
        <button
            slot="value"
            class="action w-fit flex justify-start text-center font-medium text-14 text-blue-500"
            on:click={handleTransactionIdClick}
        >
            {truncateString(activity.asyncData?.claimingTransactionId, 12, 12)}
        </button>
    </KeyValueBox>
{/if}
