<script lang="ts">
    import { Dropdown } from 'shared/components'
    import { localize } from '@core/i18n'
    import type { IDropdownItem } from '@core/utils'
    import { SelectionFilterUnit } from '@core/utils/interfaces/filter'

    export let filterUnit: SelectionFilterUnit

    const choices: IDropdownItem<string>[] = filterUnit.choices.map((choice) => ({
        label: localize(`${filterUnit.localeKey}.${choice}`),
        value: choice,
    }))

    $: value = localize(`${filterUnit.localeKey}.${filterUnit.selected}`)

    function onSelect(item: IDropdownItem<string>): void {
        filterUnit.selected = item.value
    }
</script>

<Dropdown {value} items={choices} {onSelect} small />
