<script lang="ts">
    import {
        InclusionState,
        selectedAccountAssets,
        getAssetFromPersistedAssets,
        IPersistedAsset,
        Activity,
        ActivityType,
        NotVerifiedStatus,
        ActivityAsyncStatus,
    } from '@core/wallet'
    import { openOverlay, PopupId } from '@overlay'
    import {
        ClickableTile,
        TransactionActivityTileContent,
        FoundryActivityTileContent,
        ConsolidationActivityTileContent,
        AliasActivityTileContent,
        TimelockActivityTileFooter,
        AsyncActivityTileFooter,
        NftActivityTileContent,
        GovernanceActivityTileContent,
    } from 'shared/components'
    import { time } from '@core/app'

    export let activity: Activity

    let asset: IPersistedAsset
    $: $selectedAccountAssets,
        (asset =
            activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry
                ? getAssetFromPersistedAssets(activity.assetId)
                : undefined)
    $: isTimelocked = activity?.asyncData?.timelockDate > $time
    $: shouldShowAsyncFooter = activity.asyncData && activity.asyncData.asyncStatus !== ActivityAsyncStatus.Claimed

    function onTransactionClick(): void {
        if (asset?.verification?.status === NotVerifiedStatus.New) {
            openOverlay({
                id: PopupId.TokenInformation,
                overflow: true,
                props: {
                    activityId: activity.id,
                    asset,
                },
            })
        } else {
            openOverlay({
                id: PopupId.ActivityDetails,
                props: { activityId: activity.id },
            })
        }
    }
</script>

<ClickableTile
    onClick={onTransactionClick}
    classes={activity.inclusionState === InclusionState.Pending ? 'opacity-80 animate-pulse' : ''}
>
    <activity-tile class="w-full flex flex-col space-y-4">
        <tile-content class="flex flex-row items-center text-left space-x-4">
            {#if activity.type === ActivityType.Basic}
                <TransactionActivityTileContent {activity} />
            {:else if activity.type === ActivityType.Alias}
                <AliasActivityTileContent {activity} />
            {:else if activity.type === ActivityType.Nft}
                <NftActivityTileContent {activity} />
            {:else if activity.type === ActivityType.Governance}
                <GovernanceActivityTileContent {activity} />
            {:else if activity.type === ActivityType.Consolidation}
                <ConsolidationActivityTileContent {activity} />
            {:else}
                <FoundryActivityTileContent {activity} />
            {/if}
        </tile-content>
        {#if isTimelocked}
            <TimelockActivityTileFooter {activity} />
        {:else if shouldShowAsyncFooter}
            <AsyncActivityTileFooter {activity} />
        {/if}
    </activity-tile>
</ClickableTile>
