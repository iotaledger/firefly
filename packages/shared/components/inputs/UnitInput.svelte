<script lang="typescript">
    import { Dropdown2, DropdownItem } from 'shared/components'
    import { ITokenMetadata } from '@core/wallet'
    import { Unit } from '@lib/units'

    export let unit: string
    export let isFocused: boolean
    export let tokenMetadata: ITokenMetadata

    let previousTokenMetadata: ITokenMetadata = tokenMetadata

    $: if (!unit) unit = tokenMetadata?.unit
    $: if (tokenMetadata !== previousTokenMetadata) {
        unit = tokenMetadata?.unit
        previousTokenMetadata = tokenMetadata
    }

    let items: DropdownItem<string> = []
    $: if (!tokenMetadata?.useMetricPrefix && tokenMetadata?.unit) {
        items = [{ label: tokenMetadata?.unit, value: tokenMetadata?.unit }]
        if (tokenMetadata.subunit) {
            items.push({ label: tokenMetadata?.subunit, value: tokenMetadata?.subunit })
        }
    } else if (tokenMetadata?.useMetricPrefix && tokenMetadata?.unit) {
        items = [
            { label: tokenMetadata?.unit, value: tokenMetadata?.unit },
            { label: Unit.K + tokenMetadata?.unit, value: Unit.K + tokenMetadata?.unit },
            { label: Unit.M + tokenMetadata?.unit, value: Unit.M + tokenMetadata?.unit },
            { label: Unit.G + tokenMetadata?.unit, value: Unit.G + tokenMetadata?.unit },
            { label: Unit.T + tokenMetadata?.unit, value: Unit.T + tokenMetadata?.unit },
            { label: Unit.P + tokenMetadata?.unit, value: Unit.P + tokenMetadata?.unit },
        ]
    }

    function onSelect(selected: DropdownItem<string>): void {
        unit = selected.value
    }
</script>

<Dropdown2 bind:isFocused value={unit} {items} {onSelect} contentWidth small />
