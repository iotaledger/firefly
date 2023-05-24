<script lang="ts">
    import { Radio } from '@ui'

    import type { IDropdownItem } from '@core/utils'
    import { AssetFilterUnit } from '@core/utils/interfaces/filter'
    import { visibleSelectedAccountAssets } from '@core/wallet'
    import { NetworkId } from '@core/network'

    export let filterUnit: AssetFilterUnit

    // TODO: replace Testnet with profile network
    const { baseCoin, nativeTokens } = $visibleSelectedAccountAssets?.[NetworkId.Testnet] ?? {}

    const choices: IDropdownItem<string>[] = [baseCoin, ...nativeTokens].map((choice) => ({
        label: choice.metadata.name,
        value: choice.id,
    }))

    if (!filterUnit.selected) {
        filterUnit.selected = baseCoin.id
    }

    let selectedFilterUnit: string = filterUnit.selected
    $: selectedFilterUnit, updateFilterUnit()

    function updateFilterUnit(): void {
        let asset = undefined
        if (selectedFilterUnit === baseCoin.id) {
            asset = baseCoin
        } else {
            asset = nativeTokens.find((_nativeToken) => _nativeToken.id === selectedFilterUnit)
        }
        filterUnit.selected = asset?.id || ''
    }
</script>

<asset-filter-item class="flex flex-col overflow-y-auto">
    {#each choices as choice}
        <Radio value={choice.value} bind:group={selectedFilterUnit} label={choice.label} />
    {/each}
</asset-filter-item>
