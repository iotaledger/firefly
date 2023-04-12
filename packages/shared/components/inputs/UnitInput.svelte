<script lang="ts">
    import { Dropdown2 } from 'shared/components'
    import { ITokenMetadata } from '@core/wallet'
    import { IDropdownItem, IotaUnit } from '@core/utils'

    export let unit: string
    export let isFocused: boolean
    export let tokenMetadata: ITokenMetadata
    export let disabled: boolean = false

    let previousTokenMetadata: ITokenMetadata = tokenMetadata

    $: if (!unit) unit = tokenMetadata?.unit
    $: if (tokenMetadata !== previousTokenMetadata) {
        unit = tokenMetadata?.unit
        previousTokenMetadata = tokenMetadata
    }

    let items: IDropdownItem<string>[] = []
    $: if (!tokenMetadata?.useMetricPrefix && tokenMetadata?.unit) {
        items = [{ label: tokenMetadata?.unit, value: tokenMetadata?.unit }]
        if (tokenMetadata.subunit) {
            items.push({ label: tokenMetadata?.subunit, value: tokenMetadata?.subunit })
        }
    } else if (tokenMetadata?.useMetricPrefix && tokenMetadata?.unit) {
        items = [
            { label: tokenMetadata?.unit, value: tokenMetadata?.unit },
            { label: IotaUnit.K + tokenMetadata?.unit, value: IotaUnit.K + tokenMetadata?.unit },
            { label: IotaUnit.M + tokenMetadata?.unit, value: IotaUnit.M + tokenMetadata?.unit },
            { label: IotaUnit.G + tokenMetadata?.unit, value: IotaUnit.G + tokenMetadata?.unit },
            { label: IotaUnit.T + tokenMetadata?.unit, value: IotaUnit.T + tokenMetadata?.unit },
            { label: IotaUnit.P + tokenMetadata?.unit, value: IotaUnit.P + tokenMetadata?.unit },
        ]
    }

    function onSelect(selected: IDropdownItem<string>): void {
        unit = selected.value
    }
</script>

<Dropdown2 bind:isFocused value={unit} {items} {onSelect} {disabled} contentWidth small />
