<script lang="typescript">
    import { AssetList } from 'shared/components'
    import { selectedAssets } from '@core/wallet'
</script>

<AssetList assets={$selectedAssets} />
