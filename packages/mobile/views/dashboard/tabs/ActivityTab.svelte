<script lang="typescript">
    import { isStrongholdUnlocked } from '@core/profile-manager'
    import { Activity, claimActivity } from '@core/wallet'
    import features from '@features/features'
    import { ActivityList } from '../../../../mobile/components'
    import { ActivityRoute, activityRouter } from '../../../lib/routers'
    import { selectedActivity } from '../../../lib/wallet'

    function onTileClick(activity: Activity): void {
        if (features?.dashboard?.activity?.details?.enabled) {
            $selectedActivity = activity
        }
    }

    function onReject(activity: Activity): void {
        $selectedActivity = activity
        $activityRouter?.next({ route: ActivityRoute.Reject, backToDashboard: true })
    }

    async function onClaim(activity: Activity): Promise<void> {
        const isUnlocked = await isStrongholdUnlocked()
        if (isUnlocked) {
            claimActivity(activity)
        } else {
            $selectedActivity = activity
            $activityRouter?.next({ route: ActivityRoute.Password, backToDashboard: true })
        }
    }
</script>

<ActivityList {onTileClick} {onClaim} {onReject} />
