<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        IPersistedAsset,
        ActivityVesting,
        getAssetFromPersistedAssets,
        getFormattedAmountFromActivity,
        selectedWalletAssets,
    } from '@core/wallet'
    import { ActivityTileContent, AssetIcon } from '@ui'

    export let activity: ActivityVesting

    let asset: IPersistedAsset
    $: $selectedWalletAssets, (asset = getAssetFromPersistedAssets(activity.assetId()))
    $: action = localize(activity.tileTitle())
    $: subject = activity.subjectLocale()
    $: amount = getFormattedAmountFromActivity(activity)
    $: formattedAsset = {
        text: amount,
        color: '',
        classes: 'shrink-0',
    }
</script>

<ActivityTileContent {action} {subject} {formattedAsset}>
    <AssetIcon slot="icon" {asset} />
</ActivityTileContent>
