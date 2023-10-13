<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        IPersistedAsset,
        VestingActivity,
        getActivityTileTitle,
        getAssetFromPersistedAssets,
        getFormattedAmountFromActivity,
        getSubjectLocaleFromActivity,
        selectedAccountAssets,
    } from '@core/wallet'
    import { ActivityTileContent, AssetIcon } from 'shared/components'

    export let activity: VestingActivity

    let asset: IPersistedAsset
    $: $selectedAccountAssets, (asset = getAssetFromPersistedAssets(activity.assetId))
    $: action = localize(getActivityTileTitle(activity))
    $: subject = getSubjectLocaleFromActivity(activity)
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
