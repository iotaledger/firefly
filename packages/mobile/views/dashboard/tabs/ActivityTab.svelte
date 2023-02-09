<script lang="ts">
    import { Activity } from '@core/wallet'
    import { ActivityList } from '../../../../mobile/components'
    import { DrawerId, openDrawer } from '../../../lib/auxiliary/drawer'

    function onTileClick(activity: Activity): void {
        openDrawer(DrawerId.SelectedActivity, { activity })
    }
    function onReject(): void {
        // $activityRouter?.next({ action: ActivityAction.FastReject, activity })
    }

    async function onClaim(): Promise<void> {
        // const isUnlocked = await isStrongholdUnlocked()
        // $activityRouter?.next({ action: ActivityAction.FastClaim, activity, isUnlocked })
    }
</script>

<ActivityList {onTileClick} {onClaim} {onReject} />
