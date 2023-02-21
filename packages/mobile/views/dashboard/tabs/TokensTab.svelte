<script lang="ts">
    import { IAsset, selectedAccountAssets } from '@core/wallet'
    import { AssetList } from '../../../../mobile/components'
    import { DrawerId, openDrawer } from '../../../lib/auxiliary/drawer'

    function onAssetTileClick(asset: IAsset): void {
        openDrawer(DrawerId.SelectedToken, {
            asset,
        })
    }
</script>

<AssetList assets={$selectedAccountAssets} {onAssetTileClick} />
