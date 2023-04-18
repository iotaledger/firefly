<script lang="ts">
    import { AssetList } from '@components'

    import { IAsset, selectedAccountAssets } from '@core/wallet'

    import { DrawerId, openDrawer } from '@/auxiliary/drawer'

    function onAssetTileClick(asset: IAsset): void {
        openDrawer({
            id: DrawerId.SelectedToken,
            props: {
                asset,
            },
        })
    }
</script>

<AssetList assets={$selectedAccountAssets} {onAssetTileClick} />
