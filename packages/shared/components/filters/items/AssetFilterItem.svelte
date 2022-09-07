<script lang="typescript">
    import type { AssetFilterUnit } from '@core/wallet/interfaces'
    import { Dropdown } from 'shared/components'
    import type { DropdownChoice } from '@core/utils'
    import { visibleSelectedAccountAssets } from '@core/wallet'

    export let filterUnit: AssetFilterUnit

    const choices: DropdownChoice[] = [
        $visibleSelectedAccountAssets.baseCoin,
        ...$visibleSelectedAccountAssets.nativeTokens,
    ].map((choice) => ({
        label: choice.metadata.name,
        value: choice.metadata.name,
    }))

    if (!filterUnit.selected) {
        filterUnit.selected = $visibleSelectedAccountAssets.baseCoin.id
    }

    let value: string
    $: {
        const assetId = filterUnit.selected
        if (assetId === $visibleSelectedAccountAssets.baseCoin.id) {
            value = $visibleSelectedAccountAssets.baseCoin?.metadata.name
        } else {
            value = $visibleSelectedAccountAssets.nativeTokens.find((_nativeToken) => _nativeToken.id === assetId)
                ?.metadata.name
        }
    }

    function onSelect(item) {
        let asset = undefined
        if (item.value === $visibleSelectedAccountAssets.baseCoin.metadata.name) {
            asset = $visibleSelectedAccountAssets.baseCoin
        } else {
            asset = $visibleSelectedAccountAssets.nativeTokens.find(
                (_nativeToken) => _nativeToken.metadata.name === item.value
            )
        }
        filterUnit.selected = asset?.id || ''
    }
</script>

<Dropdown {value} items={choices} {onSelect} small />
