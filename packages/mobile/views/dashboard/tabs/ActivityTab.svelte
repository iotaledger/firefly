<script lang="ts">
    import { Activity } from '@core/wallet'
    import { ActivityList } from '@components'
    import { DrawerId, openDrawer } from '@/auxiliary/drawer'
    import { handleClaimActivity, handleRejectActivity } from '@/contexts/wallet'

    function onTileClick(activity: Activity): void {
        // TODO: when token drawer is refactor, implement this
        // if (activity.type === ActivityType.Basic) {
        //     const asset = getAssetById(activity.assetId)
        //     // TODO: open token drawer to verify/skip token
        // } else {
        //     openDrawer(DrawerId.SelectedActivity, {
        //         activity,
        //     })
        // }
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
