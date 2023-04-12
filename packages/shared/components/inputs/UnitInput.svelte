<script lang="ts">
    import { Dropdown2, DropdownItem } from 'shared/components'
    import { TokenMetadata, TokenStandard, getUnitFromTokenMetadata } from '@core/wallet'
    import { IotaUnit } from '@core/utils'

    export let unit: string
    export let isFocused: boolean
    export let tokenMetadata: TokenMetadata
    export let disabled: boolean = false

    let previousTokenMetadata: TokenMetadata = tokenMetadata

    $: if (!unit) unit = getUnitFromTokenMetadata(tokenMetadata)
    $: if (tokenMetadata !== previousTokenMetadata) {
        unit = getUnitFromTokenMetadata(tokenMetadata)
        previousTokenMetadata = tokenMetadata
    }

    let items: DropdownItem<string> = []
    $: if (tokenMetadata.standard === TokenStandard.BaseToken) {
        if (tokenMetadata.useMetricPrefix) {
            items = [
                { label: tokenMetadata?.unit, value: tokenMetadata?.unit },
                { label: IotaUnit.K + tokenMetadata?.unit, value: IotaUnit.K + tokenMetadata?.unit },
                { label: IotaUnit.M + tokenMetadata?.unit, value: IotaUnit.M + tokenMetadata?.unit },
                { label: IotaUnit.G + tokenMetadata?.unit, value: IotaUnit.G + tokenMetadata?.unit },
                { label: IotaUnit.T + tokenMetadata?.unit, value: IotaUnit.T + tokenMetadata?.unit },
                { label: IotaUnit.P + tokenMetadata?.unit, value: IotaUnit.P + tokenMetadata?.unit },
            ]
        } else {
            items = [{ label: tokenMetadata?.unit, value: tokenMetadata?.unit }]
            if (tokenMetadata.subunit) {
                items.push({ label: tokenMetadata?.subunit, value: tokenMetadata?.subunit })
            }
        }
    } else {
        items = [{ label: tokenMetadata?.symbol, value: tokenMetadata?.symbol }]
    }

    function onSelect(selected: DropdownItem<string>): void {
        unit = selected.value
    }
</script>

<Dropdown2 bind:isFocused value={unit} {items} {onSelect} {disabled} contentWidth small />
