<script lang="typescript">
    import { localize } from '@core/i18n'
    import { getOfficialExplorerUrl } from '@core/network/utils'
    import {
        Text,
        Button,
        FontWeight,
        TextType,
        BasicActivityDetails,
        AliasActivityDetails,
        FoundryActivityDetails,
        NftActivityDetails,
        ActivityInformation,
    } from 'shared/components'
    import { Platform } from '@core/app'
    import {
        ActivityAsyncStatus,
        ActivityDirection,
        ActivityType,
        claimActivity,
        getAssetFromPersistedAssets,
        rejectActivity,
        selectedAccountActivities,
    } from '@core/wallet'
    import { activeProfile, checkActiveProfileAuth } from '@core/profile'
    import { setClipboard } from '@core/utils'
    import { truncateString } from '@core/utils'
    import { closePopup, openPopup } from '@auxiliary/popup'
    import { onMount } from 'svelte'
    import { ExplorerEndpoint } from '@core/network'

    export let activityId: string
    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    const explorerUrl = getOfficialExplorerUrl($activeProfile?.networkProtocol, $activeProfile?.networkType)

    $: activity = $selectedAccountActivities.find((_activity) => _activity.id === activityId)
    $: asset =
        activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry
            ? getAssetFromPersistedAssets(activity.assetId)
            : undefined
    $: isTimelocked = activity.asyncData?.asyncStatus === ActivityAsyncStatus.Timelocked
    $: isActivityIncomingAndUnclaimed =
        activity.asyncData &&
        (activity.direction === ActivityDirection.Incoming ||
            activity.direction === ActivityDirection.SelfTransaction) &&
        activity.asyncData?.asyncStatus === ActivityAsyncStatus.Unclaimed

    let details: Record<string, unknown>
    $: activity, (details = getActivityDetails())

    function getActivityDetails(): Record<string, unknown> {
        if (!activity) {
            return {}
        }
        const details = {
            transactionTime: activity.time,
            inclusionState: activity.inclusionState,
            tag: activity.tag,
            metadata: activity.metadata,
            direction: activity.direction,
            asyncStatus: activity.asyncData?.asyncStatus,
            claimedDate: activity.asyncData?.claimedDate,
            claimingTransactionId: activity.asyncData?.claimingTransactionId,
            expirationDate:
                activity.asyncData?.asyncStatus !== ActivityAsyncStatus.Claimed
                    ? activity.asyncData?.expirationDate
                    : null,
            timelockDate: activity.asyncData?.timelockDate,
            subject: activity.subject,
        }
        if (activity.type === ActivityType.Basic) {
            return {
                ...details,
                action: activity.action,
                asset,
                storageDeposit: activity.storageDeposit,
                rawAmount: activity.rawAmount,
                unit: asset?.metadata?.unit,
                giftedStorageDeposit: activity.giftedStorageDeposit,
                isInternal: activity.isInternal,
            }
        }
    }

    function handleExplorerClick(): void {
        Platform.openUrl(`${explorerUrl}/${ExplorerEndpoint.Transaction}/${activity.transactionId}`)
    }

    function handleTransactionIdClick(): void {
        setClipboard(activity.transactionId)
    }

    async function claim(): Promise<void> {
        await claimActivity(activity)
        openPopup({
            type: 'activityDetails',
            props: { activityId },
        })
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
                warning: true,
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
    <activity-details class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
        {#if activity.type === ActivityType.Basic}
            <BasicActivityDetails {activity} />
        {:else if activity.type === ActivityType.Foundry}
            <FoundryActivityDetails {activity} />
        {:else if activity.type === ActivityType.Nft}
            <NftActivityDetails {activity} />
        {:else if activity.type === ActivityType.Alias}
            <AliasActivityDetails {activity} />
        {/if}
        <ActivityInformation {activity} />
    </activity-details>
    {#if !isTimelocked && isActivityIncomingAndUnclaimed}
        <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
            <Button
                outline
                classes="w-full"
                disabled={activity.asyncData?.isClaiming || activity.asyncData?.isRejected}
                onClick={reject}
            >
                {localize('actions.reject')}
            </Button>
            <Button
                classes="w-full"
                disabled={activity.asyncData?.isClaiming}
                onClick={onClaimClick}
                isBusy={activity.asyncData?.isClaiming}
            >
                {localize('actions.claim')}
            </Button>
        </popup-buttons>
    {/if}
</activity-details-popup>
