<script lang="ts">
    import { Radio } from '@ui'

    import { localize } from '@core/i18n'
    import type { IDropdownChoice } from '@core/utils'
    import { SelectionFilterUnit } from '@core/utils/interfaces/filter'

    export let filterUnit: SelectionFilterUnit

    const choices: IDropdownChoice[] = filterUnit.choices.map((choice) => ({
        label: localize(`${filterUnit.localeKey}.${choice}`),
        value: choice,
    }))

    let selectedFilterUnit: string = filterUnit.selected
    $: selectedFilterUnit, updateFilterUnit()

    function updateFilterUnit(): void {
        filterUnit.selected = choices.find((choice) => choice.value === selectedFilterUnit).value as string
    }
</script>

<selection-filter-item class="flex flex-col overflow-y-auto">
    {#each choices as choice}
        <Radio value={choice.value} bind:group={selectedFilterUnit} label={choice.label} />
    {/each}
</selection-filter-item>
