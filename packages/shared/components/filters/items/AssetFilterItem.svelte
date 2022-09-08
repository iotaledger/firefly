<script lang="typescript">
    import type { AssetFilterUnit } from '@core/wallet/interfaces'
    import { Dropdown } from 'shared/components'
    import type { DropdownChoice } from '@core/utils'
    import { visibleSelectedAccountAssets } from '@core/wallet'

    export let filterUnit: AssetFilterUnit
    const { baseCoin, nativeTokens } = $visibleSelectedAccountAssets

    const choices: DropdownChoice[] = [baseCoin, ...nativeTokens].map((choice) => ({
        label: choice.metadata.name,
        value: choice.metadata.name,
    }))

    if (!filterUnit.selected) {
        filterUnit.selected = baseCoin.id
    }

    let value: string
    $: {
        const assetId = filterUnit.selected
        if (assetId === baseCoin.id) {
            value = baseCoin?.metadata.name
        } else {
            value = nativeTokens.find((_nativeToken) => _nativeToken.id === assetId)?.metadata.name
        }
    }

    function onSelect(item): void {
        let asset = undefined
        if (item.value === baseCoin.metadata.name) {
            asset = baseCoin
        } else {
            asset = nativeTokens.find((_nativeToken) => _nativeToken.metadata.name === item.value)
        }
        filterUnit.selected = asset?.id || ''
    }
</script>

<Dropdown {value} items={choices} {onSelect} small />
