<script lang="typescript">
    import {
        InclusionState,
        selectedAccountAssets,
        getAssetFromPersistedAssets,
        IPersistedAsset,
        Activity,
        ActivityType,
        NotVerifiedStatus,
    } from '@core/wallet'
    import { openPopup } from '@lib/popup'
    import {
        ClickableTile,
        TransactionActivityTileContent,
        FoundryActivityTileContent,
        AliasActivityTileContent,
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
        {#if activity.data.type === ActivityType.Transaction}
            <TransactionActivityTileContent
                activityId={activity.id}
                inclusionState={activity.inclusionState}
                fiatAmount={activity.getFiatAmount()}
                amount={activity.getFormattedAmount(false)}
                data={activity.data}
                {asset}
            />
        {:else if activity.data.type === ActivityType.Alias}
            <AliasActivityTileContent inclusionState={activity.inclusionState} data={activity.data} {asset} />
        {:else}
            <FoundryActivityTileContent
                inclusionState={activity.inclusionState}
                fiatAmount={activity.getFiatAmount()}
                amount={activity.getFormattedAmount(false)}
                {asset}
            />
        {/if}
    </activity-tile>
</ClickableTile>
