<script lang="typescript">
    import { onMount } from 'svelte'

    import { IotaUnit } from '@core/utils'
    import { IAsset, newTransactionDetails, selectedAccountAssets, updateNewTransactionDetails } from '@core/wallet'

    import { AssetList } from '../../../../../components'
    import { sendRouter } from '../../../../../lib/routers'

    function onAssetClick(asset: IAsset) {
        updateNewTransactionDetails({ type: $newTransactionDetails.type, asset })
        $sendRouter.next()
    }

    onMount(() => {
        updateNewTransactionDetails({
            type: $newTransactionDetails.type,
            unit: $newTransactionDetails?.unit ?? IotaUnit.M,
        })
    })
</script>

<div class="w-full overflow-y-auto flex flex-auto h-1">
    <AssetList onAssetTileClick={onAssetClick} assets={$selectedAccountAssets} />
</div>
