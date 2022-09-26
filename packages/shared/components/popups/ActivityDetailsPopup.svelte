<script lang="typescript">
    import { Text, Button } from 'shared/components'
    import { localize } from '@core/i18n'
    import { getOfficialExplorerUrl } from '@core/network/utils'
    import { Platform } from 'shared/lib/platform'
    import { FontWeight, TextType } from 'shared/components/Text.svelte'
    import { TransactionDetails } from 'shared/components/molecules'
    import {
        ActivityAsyncStatus,
        ActivityDirection,
        ActivityType,
        claimActivity,
        formatTokenAmountDefault,
        getAssetFromPersistedAssets,
        rejectActivity,
        selectedAccountActivities,
    } from '@core/wallet'
    import { activeProfile, checkActiveProfileAuth } from '@core/profile'
    import { currencies, exchangeRates } from '@lib/currency'
    import { CurrencyTypes } from 'shared/lib/typings/currency'
    import { setClipboard } from '@lib/utils'
    import { truncateString } from '@lib/helpers'
    import { closePopup, openPopup } from '@lib/popup'
    import { onMount } from 'svelte'

    export let activityId: string
    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    const explorerUrl = getOfficialExplorerUrl($activeProfile?.networkProtocol, $activeProfile?.networkType)

    $: activity = $selectedAccountActivities.find((_activity) => _activity.id === activityId)
    $: asset = getAssetFromPersistedAssets(activity?.data.assetId)
    $: amount = formatTokenAmountDefault(activity?.data.rawAmount, asset?.metadata)
    $: isTimelocked =
        activity.data.type === ActivityType.Transaction && activity.data.asyncStatus === ActivityAsyncStatus.Timelocked
    $: isActivityIncomingAndUnclaimed =
        activity.data.type === ActivityType.Transaction &&
        activity.data.isAsync &&
        (activity?.data.direction === ActivityDirection.In || activity.data.isSelfTransaction) &&
        activity.data.asyncStatus === ActivityAsyncStatus.Unclaimed

    $: transactionDetails = {
        asset,
        type: activity?.type,
        transactionTime: activity?.time,
        inclusionState: activity?.inclusionState,
        rawAmount: activity?.data.rawAmount,
        formattedFiatValue: activity?.getFiatAmount(
            $currencies[CurrencyTypes.USD],
            $exchangeRates[$activeProfile?.settings?.currency]
        ),
        storageDeposit: activity?.data.storageDeposit,
        giftedStorageDeposit: activity?.data.giftedStorageDeposit,
        amount,
        unit: asset?.metadata?.unit,
        ...(activity?.data.type === ActivityType.Transaction && {
            asyncStatus: activity?.data.asyncStatus,
            direction: activity?.data.direction,
            isInternal: activity?.data.isInternal,
            claimedDate: activity?.data.claimedDate,
            claimingTransactionId: activity?.data.claimingTransactionId,
            expirationDate: activity?.data.expirationDate,
            timelockDate: activity?.data.timelockDate,
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

    async function claim(): Promise<void> {
        if (activity.data.type === ActivityType.Transaction) {
            await claimActivity(activity.id, activity.data)
            openPopup({
                type: 'activityDetails',
                props: { activityId },
            })
        }
    }

    async function onClaimClick(): Promise<void> {
        await checkActiveProfileAuth(claim, { stronghold: true, ledger: false })
    }

    function reject(): void {
        openPopup({
            type: 'confirmation',
            props: {
                title: localize('actions.confirmRejection.title'),
                description: localize('actions.confirmRejection.description'),
                hint: localize('actions.confirmRejection.node'),
                info: true,
                confirmText: localize('actions.reject'),
                onConfirm: () => {
                    rejectActivity(activityId)
                    closePopup()
                },
                onCancel: () =>
                    openPopup({
                        type: 'activityDetails',
                        props: { activityId },
                    }),
            },
        })
    }

    onMount(async () => {
        try {
            await _onMount()
        } catch (err) {
            console.error(err)
        }
    })
</script>

<activity-details-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <div class="flex flex-col">
        <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
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
    {#if !isTimelocked && activity.data.type === ActivityType.Transaction && isActivityIncomingAndUnclaimed}
        <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
            <Button
                outline
                classes="w-full"
                disabled={activity.data.isClaiming || activity.data.isRejected}
                onClick={reject}
            >
                {localize('actions.reject')}
            </Button>
            <Button
                classes="w-full"
                disabled={activity.data.isClaiming}
                onClick={onClaimClick}
                isBusy={activity.data.isClaiming}
            >
                {localize('actions.claim')}
            </Button>
        </popup-buttons>
    {/if}
</activity-details-popup>
