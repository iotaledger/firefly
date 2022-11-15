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
    $: $selectedAccountAssets, (asset = getAssetFromPersistedAssets(activity.data.assetId))
</script>

<ClickableTile {onClick} classes={activity.inclusionState === InclusionState.Confirmed ? '' : 'opacity-50'}>
    <activity-tile class="w-full flex flex-col space-y-4">
        <tile-content class="flex flex-row items-center text-left space-x-4">
            {#if activity.data.type === ActivityType.Transaction}
                <TransactionActivityTileContent
                    inclusionState={activity.inclusionState}
                    amount={activity.getFormattedAmount()}
                    data={activity.data}
                    {asset}
                />
            {:else if activity.data.type === ActivityType.Alias}
                <AliasActivityTileContent inclusionState={activity.inclusionState} data={activity.data} />
            {:else if activity.data.type === ActivityType.Nft}
                <NftActivityTileContent inclusionState={activity.inclusionState} data={activity.data} />
            {:else}
                <FoundryActivityTileContent
                    inclusionState={activity.inclusionState}
                    amount={activity.getFormattedAmount()}
                    {asset}
                />
            {/if}
        </tile-content>
        {#if activity.data.type === ActivityType.Transaction && activity?.data.asyncStatus === ActivityAsyncStatus.Timelocked}
            <TimelockActivityTileFooter data={activity.data} />
        {:else if activity.data.type === ActivityType.Transaction && activity?.data?.isAsync}
            <AsyncActivityTileFooter activityId={activity.id} data={activity.data} />
        {/if}
    </activity-tile>
</ClickableTile>
