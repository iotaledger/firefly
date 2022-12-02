<script lang="typescript">
    import { IAsset, selectedAccountAssets } from '@core/wallet'
    import { AssetList } from '../../../../mobile/components'
    import { tokenRouter } from '../../../lib/routers'

    function onAssetTileClick(asset: IAsset): void {
        $tokenRouter?.next({ asset })
    }
</script>

<AssetList assets={$selectedAccountAssets} {onAssetTileClick} />
