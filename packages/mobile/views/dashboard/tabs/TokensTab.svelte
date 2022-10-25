<script lang="typescript">
    import { selectedAccountAssets } from '@core/wallet'
    import { AssetList } from '../../../../mobile/components'
</script>

<AssetList assets={$selectedAccountAssets} />
