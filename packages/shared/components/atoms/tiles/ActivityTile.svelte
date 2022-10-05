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
        AsyncActivityActions,
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
        <info-container class="flex flex-row items-center text-left space-x-4">
            {#if activity.data.type === ActivityType.Transaction}
                <TransactionActivityTileContent
                    inclusionState={activity.inclusionState}
                    fiatAmount={activity.getFiatAmount()}
                    amount={activity.getFormattedAmount(false)}
                    data={activity.data}
                    {asset}
                />
            {:else if activity.data.type === ActivityType.Alias}
                <AliasActivityTileContent inclusionState={activity.inclusionState} data={activity.data} />
            {:else}
                <FoundryActivityTileContent
                    inclusionState={activity.inclusionState}
                    fiatAmount={activity.getFiatAmount()}
                    amount={activity.getFormattedAmount(false)}
                    {asset}
                />
            {/if}
        </info-container>
        {#if activity.data.type === ActivityType.Transaction}
            <AsyncActivityActions activityId={activity.id} data={activity.data} />
        {/if}
    </activity-tile>
</ClickableTile>
