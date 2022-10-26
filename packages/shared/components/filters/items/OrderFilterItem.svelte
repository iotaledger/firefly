<script lang="typescript">
    import type { OrderFilterUnit } from '@core/wallet/interfaces'
    import { Dropdown } from 'shared/components'
    import { localize } from '@core/i18n'
    import type { IDropdownChoice } from '@core/utils'
    import { OrderOption } from '@core/wallet'

    export let filterUnit: OrderFilterUnit

    const choices: IDropdownChoice[] = filterUnit.choices.map((choice) => ({
        label: localize(`${filterUnit.localeKey}.${choice}`),
        value: choice,
    }))

    const ascDescChoices: IDropdownChoice[] = [OrderOption.Asc, OrderOption.Desc].map((choice) => ({
        label: localize(`filters.ascDesc.${choice}`),
        value: choice,
    }))

    $: value = localize(`${filterUnit.localeKey}.${filterUnit.selected}`)
    $: ascDescvalue = localize(`filters.ascDesc.${filterUnit.ascDesc}`)

    function onSelect(item): void {
        filterUnit.selected = item.value
    }

    function onSelectAscDesc(item): void {
        filterUnit.ascDesc = item.value
    }
</script>

<div class="flex flex-row justify-between space-x-2">
    <Dropdown {value} items={choices} {onSelect} small classes="mb-4" />
    <Dropdown value={ascDescvalue} items={ascDescChoices} onSelect={onSelectAscDesc} small />
</div>
