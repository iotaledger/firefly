<script lang="typescript">
    import { Text, Spinner } from 'shared/components'
    import { localize } from '@core/i18n'
    import { getOfficialExplorerUrl } from '@core/network/utils'
    import { Platform } from 'shared/lib/platform'
    import { FontWeight } from 'shared/components/Text.svelte'
    import { TransactionDetails } from 'shared/components/molecules'
    import {
        ActivityAsyncStatus,
        ActivityDirection,
        claimActivity,
        formatTokenAmountDefault,
        selectedAccountActivities,
        getAssetFromPersistedAssets,
        rejectActivity,
    } from '@core/wallet'
    import { activeProfile } from '@core/profile'
    import { currencies, exchangeRates } from '@lib/currency'
    import { CurrencyTypes } from 'shared/lib/typings/currency'
    import { setClipboard } from '@lib/utils'
    import { truncateString } from '@lib/helpers'
    import { closePopup, openPopup } from '@lib/popup'

    export let activityId: string

    const explorerUrl = getOfficialExplorerUrl($activeProfile?.networkProtocol, $activeProfile?.networkType)

    $: activity = $selectedAccountActivities.find((_activity) => _activity.id === activityId)
    $: asset = getAssetFromPersistedAssets(activity?.data.assetId)
    $: amount = formatTokenAmountDefault(activity?.data.rawAmount, asset?.metadata)

    $: transactionDetails = {
        asset,
        time: activity.time,
        direction: ActivityDirection.Out,
        inclusionState: activity?.inclusionState,
        rawAmount: activity?.data.rawAmount,
        formattedFiatValue: activity.getFiatAmount(
            $currencies[CurrencyTypes.USD],
            $exchangeRates[$activeProfile?.settings?.currency]
        ),
        storageDeposit: activity.data.storageDeposit,
        giftedStorageDeposit: activity.data.giftedStorageDeposit,
        amount,
        unit: asset?.metadata?.unit,
        ...(activity?.data.type === 'transaction' && {
            asyncStatus: activity.data.asyncStatus,
            claimedDate: activity.data.claimedDate,
            claimingTransactionId: activity.data.claimingTransactionId,
            expirationDate: activity.data.expirationDate,
            subject: activity?.data?.subject,
            tag: activity?.data?.tag,
            metadata: activity?.data?.metadata,
        }),
    }

    function handleExplorerClick(): void {
        Platform.openUrl(`${explorerUrl}/block/${activity.transactionId}`)
    }

    function handleTransactionIdClick(): void {
        setClipboard(activity.transactionId)
    }

    async function claim() {
        await claimActivity(activity)
        openPopup({
            type: 'activityDetails',
            props: { activityId: activity.id },
        })
    }

    function reject() {
        openPopup({
            type: 'confirmation',
            props: {
                title: localize('actions.confirmRejection.title'),
                description: localize('actions.confirmRejection.description'),
                hint: localize('actions.confirmRejection.node'),
                warning: true,
                confirmText: localize('actions.reject'),
                onConfirm: () => {
                    rejectActivity(activity.id)
                    closePopup()
                },
                onCancel: () =>
                    openPopup({
                        type: 'activityDetails',
                        props: { activityId: activity.id },
                    }),
            },
        })
    }
</script>

<activity-details-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <div class="flex flex-col">
        <Text type="h3" fontWeight={FontWeight.semibold} classes="text-left">
            {localize('popups.transactionDetails.title')}
        </Text>
        {#if explorerUrl && activity.transactionId}
            <button
                class="action w-fit flex justify-start text-center font-medium text-14 text-blue-500"
                on:click={handleExplorerClick}
            >
                {localize('general.viewOnExplorer')}
            </button>
        {:else if activity.transactionId}
            <button
                class="action w-fit flex justify-start text-center font-medium text-14 text-blue-500"
                on:click={handleTransactionIdClick}
            >
                {truncateString(activity.transactionId, 12, 12)}
            </button>
        {/if}
    </div>
    <TransactionDetails {...transactionDetails} />
    {#if activity.data.type === 'transaction' && activity.data.isAsync && (activity?.data.direction === ActivityDirection.In || activity.data.isSelfTransaction) && activity.data.asyncStatus === ActivityAsyncStatus.Unclaimed}
        <div class="flex w-full justify-between space-x-4">
            <button
                disabled={activity.data.isClaiming || activity.data.isRejected}
                class="action p-4 w-full text-center font-medium text-15 text-blue-500 rounded-lg border border-solid border-gray-300 {activity
                    .data.isClaiming || activity.data.isRejected
                    ? 'cursor-default text-gray-500'
                    : 'cursor-pointer'}"
                on:click={reject}
            >
                {localize('actions.reject')}
            </button>
            <button
                disabled={activity.data.isClaiming}
                class="action p-4 w-full text-center rounded-lg font-medium text-15 bg-blue-500 text-white"
                on:click={claim}
            >
                {#if activity.data.isClaiming}
                    <Spinner busy={true} classes="justify-center" />
                {:else}
                    {localize('actions.claim')}
                {/if}
            </button>
        </div>
    {/if}
</activity-details-popup>
