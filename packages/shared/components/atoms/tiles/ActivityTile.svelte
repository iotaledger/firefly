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
    $: $selectedAccountAssets, (asset = getAssetFromPersistedAssets(activity.data.assetId))

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
            {#if activity.data.type === ActivityType.Transaction}
                <TransactionActivityTileContent
                    inclusionState={activity.inclusionState}
                    fiatAmount={activity.getFiatAmount()}
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
                    fiatAmount={activity.getFiatAmount()}
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
