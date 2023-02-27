<script lang="ts">
    import {
        ActivityInformation,
        AliasActivityDetails,
        BasicActivityDetails,
        Button,
        FoundryActivityDetails,
        NftActivityDetails,
    } from '@ui'

    import { localize } from '@core/i18n'
    import { ActivityAsyncStatus, ActivityDirection, ActivityType, selectedAccountActivities } from '@core/wallet'

    import { handleClaimActivity, handleRejectActivity } from '@/contexts/wallet'
    import features from '@features/features'

    export let activityId: string

    $: activity = $selectedAccountActivities.find((_activity) => _activity.id === activityId)
    $: isTimelocked = activity.asyncData?.asyncStatus === ActivityAsyncStatus.Timelocked
    $: isActivityIncomingAndUnclaimed =
        activity.asyncData &&
        (activity.direction === ActivityDirection.Incoming ||
            activity.direction === ActivityDirection.SelfTransaction) &&
        activity.asyncData?.asyncStatus === ActivityAsyncStatus.Unclaimed

    function onReject(): void {
        handleRejectActivity(activity.id)
    }
    function onClaim(): void {
        void handleClaimActivity(activity)
    }
</script>

<activity-details class="flex flex-col justify-between h-full space-y-10">
    <activity-content class="flex flex-col space-y-8">
        {#if activity?.type === ActivityType.Basic}
            <BasicActivityDetails {activity} />
        {:else if activity.type === ActivityType.Foundry}
            <FoundryActivityDetails {activity} />
        {:else if activity.type === ActivityType.Nft}
            <NftActivityDetails {activity} />
        {:else if activity.type === ActivityType.Alias}
            <AliasActivityDetails {activity} />
        {/if}
        <ActivityInformation {activity} />
    </activity-content>
    {#if !isTimelocked && isActivityIncomingAndUnclaimed && features.dashboard.activity.actions.enabled}
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
