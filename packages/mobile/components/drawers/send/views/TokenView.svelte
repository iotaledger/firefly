<script lang="ts">
    import { IAsset, newTransactionDetails, selectedAccountAssets, updateNewTransactionDetails } from '@core/wallet'

    import { AssetList } from '@components'
    import { sendRouter } from '@/routers'

    function onAssetClick(asset: IAsset) {
        updateNewTransactionDetails({ type: $newTransactionDetails.type, asset })
        $sendRouter.next()
    }
</script>

<div class="w-full overflow-y-auto flex flex-auto h-1">
    <AssetList onAssetTileClick={onAssetClick} assets={$selectedAccountAssets} />
</div>
