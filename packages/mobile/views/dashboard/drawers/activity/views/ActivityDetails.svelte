<script lang="typescript">
    import { localize } from '@core/i18n'
    import { isStrongholdUnlocked } from '@core/profile-manager'
    import {
        Activity,
        ActivityAsyncStatus,
        ActivityDirection,
        ActivityType,
        claimActivity,
        getAssetFromPersistedAssets,
    } from '@core/wallet'
    import features from '@features/features'
    import { Button } from 'shared/components'
    import { BasicActivityDetails } from '../../../../../components'
    import { ActivityRoute, activityRouter } from '../../../../../lib/routers'

    export let activity: Activity

    let details: Record<string, unknown>

    $: activity && (details = getActivityDetails())

    $: isActivityIncomingAndUnclaimed =
        activity &&
        activity.asyncData &&
        (activity?.direction === ActivityDirection.Incoming || activity.isSelfTransaction) &&
        activity.asyncData?.asyncStatus === ActivityAsyncStatus.Unclaimed

    $: shouldShowActions =
        isActivityIncomingAndUnclaimed &&
        activity.asyncData?.asyncStatus !== ActivityAsyncStatus.Timelocked &&
        features.dashboard.activity.actions.enabled

    function getActivityDetails(): Record<string, unknown> {
        if (!activity) {
            return {}
        }

        const asset =
            activity.type === ActivityType.Transaction || activity.type === ActivityType.Foundry
                ? getAssetFromPersistedAssets(activity.assetId)
                : undefined

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
        if (activity.type === ActivityType.Transaction) {
            return {
                ...details,
                type: activity.type,
                asset,
                storageDeposit: activity.storageDeposit,
                rawAmount: activity.rawAmount,
                unit: asset?.metadata?.unit,
                giftedStorageDeposit: activity.giftedStorageDeposit,
                isInternal: activity.isInternal,
            }
        }
    }
    async function onClaim(): Promise<void> {
        const isUnlocked = await isStrongholdUnlocked()
        if (isUnlocked) {
            claimActivity(activity)
        } else {
            $activityRouter?.goTo(ActivityRoute.Password)
        }
    }
    function onReject(): void {
        $activityRouter?.goTo(ActivityRoute.Reject)
    }
</script>

<activity-details class="flex flex-col justify-between h-full pt-10">
    <activity-content>
        {#if activity?.type === ActivityType.Transaction}
            <BasicActivityDetails {...details} />
        {/if}
    </activity-content>
    {#if shouldShowActions}
        <activity-actions class="space-y-4">
            <Button
                classes="w-full"
                disabled={activity.asyncData?.isClaiming}
                onClick={onClaim}
                isBusy={activity.asyncData?.isClaiming}
            >
                {localize('actions.claim')}
            </Button>
            <Button
                outline
                classes="w-full"
                disabled={activity.asyncData?.isClaiming || activity.asyncData?.isRejected}
                onClick={onReject}
            >
                {localize('actions.reject')}
            </Button>
        </activity-actions>
    {/if}
</activity-details>
