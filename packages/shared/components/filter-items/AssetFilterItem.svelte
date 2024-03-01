<script lang="ts">
    import { Dropdown } from '@ui'
    import type { IDropdownItem } from '@core/utils'
    import { visibleSelectedWalletAssets } from '@core/wallet'
    import { AssetFilterUnit } from '@core/utils/interfaces/filter'
    import { activeProfile } from '@core/profile'

    export let filterUnit: AssetFilterUnit
    const { baseCoin, nativeTokens } = $visibleSelectedWalletAssets[$activeProfile?.network?.id]

    const choices: IDropdownItem<string>[] = [baseCoin, ...nativeTokens].map((choice) => ({
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
            value = nativeTokens.find((_nativeToken) => _nativeToken.id === assetId)?.metadata?.name
        }
    }

    function onSelect(item: IDropdownItem<string>): void {
        let asset = undefined
        if (item.value === baseCoin.metadata.name) {
            asset = baseCoin
        } else {
            asset = nativeTokens.find((_nativeToken) => _nativeToken.metadata?.name === item.value)
        }
        filterUnit.selected = asset?.id || ''
    }
</script>

<Dropdown {value} items={choices} {onSelect} small />
