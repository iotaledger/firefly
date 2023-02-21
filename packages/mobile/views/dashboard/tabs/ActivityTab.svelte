<script lang="ts">
    import { Activity, ActivityType, getAssetFromPersistedAssets, NotVerifiedStatus } from '@core/wallet'
    import { ActivityList } from '../../../../mobile/components'
    import { DrawerId, openDrawer } from '../../../lib/auxiliary/drawer'
    import { handleClaimActivity, handleRejectActivity } from '../../../lib/contexts/wallet'

    function onTileClick(activity: Activity): void {
        const asset =
            activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry
                ? getAssetFromPersistedAssets(activity.assetId)
                : undefined
        if (asset?.verification?.status === NotVerifiedStatus.New) {
            openDrawer(DrawerId.SelectedToken, {
                asset,
                activityId: activity.id,
            })
        } else {
            openDrawer(DrawerId.SelectedActivity, {
                activityId: activity.id,
            })
        }
    }

    function onReject(activityId: string): void {
        handleRejectActivity(activityId)
    }

    function onClaim(activity: Activity): void {
        void handleClaimActivity(activity)
    }
</script>

<ActivityList {onTileClick} {onClaim} {onReject} />
