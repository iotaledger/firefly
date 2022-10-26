<script lang="typescript">
    import { IAsset, selectedAccountAssets, updateNewTransactionDetails } from '@core/wallet'
    import { AssetList } from '../../../../../../mobile/components'
    import { sendRouter } from '../../../../../lib/routers'

    function onAssetClick(asset: IAsset) {
        updateNewTransactionDetails({ asset })
        $sendRouter.next()
    }
</script>

<div class="w-full overflow-y-auto flex flex-auto h-1">
    <AssetList onAssetTileClick={onAssetClick} assets={$selectedAccountAssets} />
</div>
