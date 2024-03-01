<script lang="ts">
    import { Dropdown2 } from '@ui'
    import { TokenMetadata, TokenStandard, getUnitFromTokenMetadata } from '@core/wallet'
    import { IDropdownItem } from '@core/utils'

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

    let items: IDropdownItem<string>[] = []
    $: if (tokenMetadata.standard === TokenStandard.BaseToken) {
        items = [{ label: tokenMetadata?.unit, value: tokenMetadata?.unit }]
        if (tokenMetadata.subunit) {
            items.push({ label: tokenMetadata?.subunit, value: tokenMetadata?.subunit })
        }
    } else {
        items = [{ label: tokenMetadata?.symbol, value: tokenMetadata?.symbol }]
    }

    function onSelect(selected: IDropdownItem<string>): void {
        unit = selected.value
    }
</script>

<Dropdown2 bind:isFocused value={unit} {items} {onSelect} {disabled} contentWidth small />
