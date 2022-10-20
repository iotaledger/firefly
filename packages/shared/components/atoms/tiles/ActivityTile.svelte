<script lang="typescript">
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
    import { openPopup } from '@auxiliary/popup'
    import {
        ClickableTile,
        TransactionActivityTileContent,
        FoundryActivityTileContent,
        AliasActivityTileContent,
        TimelockActivityTileFooter,
        AsyncActivityTileFooter,
        NftActivityTileContent,
    } from 'shared/components'

    export let activity: Activity

    let asset: IPersistedAsset
    $: $selectedAccountAssets,
        (asset = activity.type !== ActivityType.Nft ? getAssetFromPersistedAssets(activity.assetId) : undefined)

    function handleTransactionClick(): void {
        if (asset?.verification?.status === NotVerifiedStatus.New) {
            openPopup({
                type: 'tokenInformation',
                overflow: true,
                props: {
                    activityId: activity.id,
                    asset,
                },
            })
        } else {
            openPopup({
                type: 'activityDetails',
                props: { activityId: activity.id },
            })
        }
    }
</script>

<ClickableTile
    onClick={handleTransactionClick}
    classes={activity.inclusionState === InclusionState.Confirmed ? '' : 'opacity-50'}
>
    <activity-tile class="w-full flex flex-col space-y-4">
        <tile-content class="flex flex-row items-center text-left space-x-4">
            {#if activity.type === ActivityType.Transaction}
                <TransactionActivityTileContent {activity} {asset} />
            {:else if activity.type === ActivityType.Alias}
                <AliasActivityTileContent {activity} />
            {:else if activity.type === ActivityType.Nft}
                <NftActivityTileContent {activity} />
            {:else}
                <FoundryActivityTileContent {activity} {asset} />
            {/if}
        </tile-content>
        {#if activity.type === ActivityType.Transaction && activity?.asyncStatus === ActivityAsyncStatus.Timelocked}
            <TimelockActivityTileFooter {activity} />
        {:else if (activity.type === ActivityType.Transaction || activity.type === ActivityType.Nft) && activity.isAsync}
            <AsyncActivityTileFooter {activity} />
        {/if}
    </activity-tile>
</ClickableTile>
