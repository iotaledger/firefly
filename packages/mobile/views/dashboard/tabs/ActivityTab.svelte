<script lang="typescript">
    import features from '@features/features'
    import { isStrongholdUnlocked } from '@core/profile-manager'
    import { Activity, claimActivity } from '@core/wallet'
    import { ActivityList } from '../../../../mobile/components'
    import { ActivityRoute, activityRouter } from '../../../lib/routers'
    import { selectedActivity } from '../../../lib/wallet'

    function onTileClick(activity: Activity): void {
        if (features?.dashboard?.activity?.details?.enabled) {
            $selectedActivity = activity
            $activityRouter?.goTo(ActivityRoute.Details)
        }
    }

    function onReject(activity: Activity): void {
        $selectedActivity = activity
        $activityRouter?.goTo(ActivityRoute.Reject)
    }

    async function onClaim(activity: Activity): Promise<void> {
        const isUnlocked = await isStrongholdUnlocked()
        if (isUnlocked) {
            claimActivity(activity)
        } else {
            $selectedActivity = activity
            $activityRouter?.goTo(ActivityRoute.Password)
        }
    }
</script>

<ActivityList {onTileClick} {onClaim} {onReject} />
