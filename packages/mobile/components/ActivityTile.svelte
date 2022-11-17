<script lang="typescript">
    import {
        Activity,
        ActivityAsyncStatus,
        ActivityType,
        getAssetFromPersistedAssets,
        InclusionState,
        IPersistedAsset,
        selectedAccountAssets,
    } from '@core/wallet'
    import {
        AliasActivityTileContent,
        AsyncActivityTileFooter,
        ClickableTile,
        FoundryActivityTileContent,
        NftActivityTileContent,
        TimelockActivityTileFooter,
        TransactionActivityTileContent,
    } from 'shared/components'

    export let activity: Activity
    export let onClick: () => unknown = () => {}

    let asset: IPersistedAsset
    $: $selectedAccountAssets,
        (asset =
            activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry
                ? getAssetFromPersistedAssets(activity.assetId)
                : undefined)
</script>

<ClickableTile {onClick} classes={activity.inclusionState === InclusionState.Confirmed ? '' : 'opacity-50'}>
    <activity-tile class="w-full flex flex-col space-y-4">
        <tile-content class="flex flex-row items-center text-left space-x-4">
            {#if activity.type === ActivityType.Basic}
                <TransactionActivityTileContent {activity} />
            {:else if activity.type === ActivityType.Alias}
                <AliasActivityTileContent {activity} />
            {:else if activity.type === ActivityType.Nft}
                <NftActivityTileContent {activity} />
            {:else}
                <FoundryActivityTileContent {activity} />
            {/if}
        </tile-content>
        {#if activity.asyncData?.asyncStatus === ActivityAsyncStatus.Timelocked}
            <TimelockActivityTileFooter {activity} />
        {:else if activity.asyncData}
            <AsyncActivityTileFooter {activity} />
        {/if}
    </activity-tile>
</ClickableTile>
