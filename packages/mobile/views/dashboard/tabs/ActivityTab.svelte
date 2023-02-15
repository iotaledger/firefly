<script lang="ts">
    import { Activity } from '@core/wallet'
    import { ActivityList } from '../../../../mobile/components'
    import { DrawerId, openDrawer } from '../../../lib/auxiliary/drawer'
    import { handleClaimActivity, handleRejectActivity } from '../../../lib/contexts/dashboard'

    function onTileClick(activity: Activity): void {
        openDrawer(DrawerId.SelectedActivity, {
            activity,
        })
    }

    function onReject(activityId: string): void {
        handleRejectActivity(activityId)
    }

    function onClaim(activity: Activity): void {
        void handleClaimActivity(activity)
    }
</script>

<ActivityList {onTileClick} {onClaim} {onReject} />
