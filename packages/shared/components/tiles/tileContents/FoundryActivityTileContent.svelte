<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        ActivityFoundry,
        getAssetFromPersistedAssets,
        getFormattedAmountFromActivity,
        IPersistedAsset,
        selectedWalletAssets,
    } from '@core/wallet'
    import { AssetIcon, ActivityTileContent } from '@ui'

    export let activity: ActivityFoundry

    let asset: IPersistedAsset | undefined
    $: $selectedWalletAssets, (asset = getAssetFromPersistedAssets(activity.assetId()))
    $: action = localize(activity.tileTitle())
    $: amount = getFormattedAmountFromActivity(activity)
    $: formattedAsset = {
        text: amount,
        color: 'blue-700',
        classes: 'shrink-0',
    }
</script>

{#if asset}
    <ActivityTileContent {action} subject={localize('general.internalTransaction')} {formattedAsset}>
        <AssetIcon slot="icon" {asset} />
    </ActivityTileContent>
{/if}
