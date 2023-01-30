<script lang="typescript">
    import { localize } from '@core/i18n'
    import {
        FoundryActivity,
        getActivityTileTitle,
        getAssetFromPersistedAssets,
        getFormattedAmountFromActivity,
        IPersistedAsset,
        selectedAccountAssets,
    } from '@core/wallet'
    import { truncateString } from '@core/utils'
    import { AssetIcon, ActivityTileContent } from 'shared/components'

    export let activity: FoundryActivity

    let asset: IPersistedAsset
    $: $selectedAccountAssets, (asset = getAssetFromPersistedAssets(activity.assetId))
    $: title = localize(getActivityTileTitle(activity))
    $: subtitle = asset?.metadata?.name ? truncateString(asset?.metadata?.name, 20, 0) : truncateString(asset?.id, 6, 7)
    $: amount = getFormattedAmountFromActivity(activity)
</script>

<ActivityTileContent {title} {subtitle} {amount} amountColor="blue-700">
    <AssetIcon slot="icon" {asset} showVerifiedBadgeOnly />
</ActivityTileContent>
