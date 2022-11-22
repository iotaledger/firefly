<script lang="typescript">
    import { isStrongholdUnlocked } from '@core/profile-manager'
    import { Activity, ActivityAsyncStatus, ActivityType, claimActivity, InclusionState } from '@core/wallet'
    import {
        AliasActivityTileContent,
        ClickableTile,
        FoundryActivityTileContent,
        NftActivityTileContent,
        TimelockActivityTileFooter,
        TransactionActivityTileContent,
    } from 'shared/components'
    import { AsyncActivityTileFooter } from '../components'
    import { activityRouter, ActivityRoute } from '../lib/routers'
    import { selectedActivity } from '../lib/wallet'

    export let activity: Activity
    export let onClick: () => unknown = () => {}

    function handleOnClick(): void {
        $selectedActivity = activity
        $activityRouter?.goTo(ActivityRoute.Details)
        onClick()
    }

    function onReject(): void {
        $selectedActivity = activity
        $activityRouter?.goTo(ActivityRoute.Reject)
    }

    async function onClaim(): Promise<void> {
        const isUnlocked = await isStrongholdUnlocked()
        if (isUnlocked) {
            claimActivity(activity)
        } else {
            $selectedActivity = activity
            $activityRouter?.goTo(ActivityRoute.Password)
        }
    }
</script>

<ClickableTile
    onClick={handleOnClick}
    classes={activity.inclusionState === InclusionState.Confirmed ? '' : 'opacity-50'}
>
    <activity-tile class="w-full flex flex-col space-y-4">
        <tile-content class="flex flex-row items-center text-left space-x-4">
            {#if activity.type === ActivityType.Transaction}
                <TransactionActivityTileContent {activity} />
            {:else if activity.type === ActivityType.Alias}
                <AliasActivityTileContent {activity} />
            {:else if activity.type === ActivityType.Nft}
                <NftActivityTileContent {activity} />
            {:else}
                <FoundryActivityTileContent {activity} />
            {/if}
        </tile-content>
        {#if activity.asyncData?.asyncStatus === ActivityAsyncStatus.Timelocked}
            <TimelockActivityTileFooter {activity} />
        {:else if activity.asyncData}
            <AsyncActivityTileFooter {activity} {onClaim} {onReject} />
        {/if}
    </activity-tile>
</ClickableTile>
