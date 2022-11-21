<script lang="typescript">
    import { localize } from '@core/i18n'
    import { isStrongholdUnlocked } from '@core/profile-manager'
    import { Activity, ActivityAsyncStatus, ActivityDirection, claimActivity } from '@core/wallet'
    import features from '@features/features'
    import { Button } from 'shared/components'
    import { ActivityRoute, activityRouter } from '../../../../../lib/routers'

    export let activity: Activity

    $: shouldShowActions =
        activity &&
        activity.direction === ActivityDirection.Incoming &&
        activity.asyncData?.asyncStatus === ActivityAsyncStatus.Unclaimed &&
        features.dashboard.activity.actions.enabled

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
