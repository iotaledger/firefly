<script lang="typescript">
    import { isStrongholdUnlocked } from '@core/profile-manager'
    import { Activity } from '@core/wallet'
    import { ActivityList } from '../../../../mobile/components'
    import { ActivityAction } from '../../../lib/contexts/dashboard'
    import { activityRouter } from '../../../lib/routers'

    function onTileClick(activity: Activity): void {
        $activityRouter?.next({ activity })
    }
    function onReject(activity: Activity): void {
        $activityRouter?.next({ action: ActivityAction.FastReject, activity })
    }

    async function onClaim(activity: Activity): Promise<void> {
        const isUnlocked = await isStrongholdUnlocked()
        $activityRouter?.next({ action: ActivityAction.FastClaim, activity, isUnlocked })
    }
</script>

<ActivityList {onTileClick} {onClaim} {onReject} />
