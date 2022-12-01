<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Activity, ActivityAsyncStatus, ActivityDirection, ActivityType } from '@core/wallet'
    import features from '@features/features'
    import {
        Button,
        BasicActivityDetails,
        AliasActivityDetails,
        FoundryActivityDetails,
        NftActivityDetails,
        ActivityInformation,
    } from 'shared/components'

    export let activity: Activity
    export let onClaim: () => unknown = () => {}
    export let onReject: () => unknown = () => {}

    $: isActivityIncomingAndUnclaimed =
        activity &&
        activity.asyncData &&
        (activity?.direction === ActivityDirection.Incoming ||
            activity?.direction === ActivityDirection.SelfTransaction) &&
        activity.asyncData?.asyncStatus === ActivityAsyncStatus.Unclaimed

    $: shouldShowActions =
        isActivityIncomingAndUnclaimed &&
        activity.asyncData?.asyncStatus !== ActivityAsyncStatus.Timelocked &&
        features.dashboard.activity.actions.enabled
</script>

<activity-details class="flex flex-col justify-between h-full pt-10">
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
