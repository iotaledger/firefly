<script lang="ts">
    import { PopupId, openPopup } from '@auxiliary/popup'
    import { time } from '@core/app'
    import {
        Activity,
        ActivityAsyncStatus,
        ActivityType,
        IAsset,
        InclusionState,
        NotVerifiedStatus,
        getTokenFromSelectedWallet,
        selectedWalletAssets,
    } from '@core/wallet'
    import {
        ActivityInclusionStatusPill,
        AliasActivityTileContent,
        AsyncActivityTileFooter,
        ClickableTile,
        ConsolidationActivityTileContent,
        FoundryActivityTileContent,
        GovernanceActivityTileContent,
        NftActivityTileContent,
        TileFooter,
        TimelockActivityTileFooter,
        TransactionActivityTileContent,
        VestingActivityTileContent,
    } from 'shared/components'

    export let activity: Activity

    let asset: IAsset | undefined
    $: $selectedWalletAssets,
        (asset =
            activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry
                ? getTokenFromSelectedWallet(activity.assetId)
                : undefined)
    $: isConflicting = activity.inclusionState === InclusionState.Conflicting
    $: isTimelocked = !isConflicting && activity?.asyncData?.timelockDate > $time
    $: shouldShowAsyncFooter =
        !isConflicting && activity.asyncData && activity.asyncData.asyncStatus !== ActivityAsyncStatus.Claimed

    function onTransactionClick(): void {
        if (asset?.verification?.status === NotVerifiedStatus.New) {
            openPopup({
                id: PopupId.TokenInformation,
                overflow: true,
                props: {
                    activityId: activity.id,
                    asset,
                },
            })
        } else {
            openPopup({
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
            {:else if activity.type === ActivityType.Vesting}
                <VestingActivityTileContent {activity} />
            {:else}
                <FoundryActivityTileContent {activity} />
            {/if}
        </tile-content>
        {#if isConflicting}
            <TileFooter>
                <svelte:fragment slot="right">
                    <ActivityInclusionStatusPill
                        inclusionState={activity.inclusionState}
                        localizationKey="external.outgoing"
                    />
                </svelte:fragment>
            </TileFooter>
        {:else if isTimelocked}
            <TimelockActivityTileFooter {activity} />
        {:else if shouldShowAsyncFooter}
            <AsyncActivityTileFooter {activity} />
        {/if}
    </activity-tile>
</ClickableTile>
