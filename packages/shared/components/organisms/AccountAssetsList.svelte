<script lang="ts">
    import { AssetList } from 'shared/components'
    import { selectedAccountAssets } from '@core/wallet'
</script>

<AssetList assets={$selectedAccountAssets} />
