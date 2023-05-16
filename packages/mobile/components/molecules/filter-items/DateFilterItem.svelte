<script lang="ts">
    import { DateInputButton } from '@components'
    import { Icon, NumberInput, Radio, Text } from '@ui'

    import { localize } from '@core/i18n'
    import type { IDropdownItem } from '@core/utils'
    import { DateFilterOption, DateUnit } from '@core/utils/enums/filters'
    import { DateFilterUnit } from '@core/utils/interfaces/filter'

    import { Icon as IconEnum } from '@lib/auxiliary/icon'

    export let filterUnit: DateFilterUnit

    const choices: IDropdownItem<DateFilterOption>[] = filterUnit.choices.map((choice) => ({
        label: localize(`${filterUnit.localeKey}.${choice}`),
        value: choice,
    }))

    const unitChoices: IDropdownItem<string>[] = Object.keys(DateUnit).map((val) => ({
        label: localize(`${filterUnit.localeKey}.${val}`),
        value: val,
    }))

    let selectedFilterUnit: DateFilterOption = filterUnit.selected
    $: selectedFilterUnit, updateFilterUnit()

    function updateFilterUnit(): void {
        const updated = filterUnit.selected !== selectedFilterUnit
        filterUnit.selected = selectedFilterUnit

        if (updated) {
            switch (filterUnit.selected) {
                case DateFilterOption.Equals:
                case DateFilterOption.After:
                case DateFilterOption.AfterOrEquals:
                case DateFilterOption.Before:
                    filterUnit.subunit = {
                        type: 'single',
                        value: undefined,
                    }
                    break
                case DateFilterOption.Range:
                    filterUnit.subunit = {
                        type: 'range',
                        start: undefined,
                        end: undefined,
                    }
                    break
                case DateFilterOption.Last:
                    filterUnit.subunit = {
                        type: 'unit',
                        amount: '0',
                        unit: DateUnit.Days,
                    }
                    break
            }
        }
    }

    function updateSubunitStart(value: string): void {
        if (filterUnit.subunit.type === 'range') {
            filterUnit.subunit.start = value
        }
    }
    function updateSubunitEnd(value: string): void {
        if (filterUnit.subunit.type === 'range') {
            filterUnit.subunit.end = value
        }
    }
    function updateSubunitValue(value: string): void {
        if (filterUnit.subunit.type === 'single') {
            filterUnit.subunit.value = value
        }
    }
</script>

<date-filter-options class="flex flex-col overflow-y-auto">
    {#each choices as choice}
        <Radio value={choice.value} bind:group={selectedFilterUnit} label={choice.label} />
    {/each}
</date-filter-options>

{#if filterUnit.selected}
    <div class="flex flex-row items-center space-x-2 mt-2">
        {#if filterUnit.selected !== DateFilterOption.Range}
            <Icon height="24" width="20" icon={IconEnum.ArrowRight} />
        {/if}
        {#if filterUnit.subunit.type === 'range'}
            <DateInputButton value={filterUnit.subunit.start} onConfirm={updateSubunitStart} />
            <Text>{localize('general.and')}</Text>
            <DateInputButton value={filterUnit.subunit.end} onConfirm={updateSubunitEnd} />
        {:else if filterUnit.subunit.type === 'single'}
            <DateInputButton value={filterUnit.subunit.value} onConfirm={updateSubunitValue} />
        {:else if filterUnit.subunit.type === 'unit'}
            <NumberInput bind:value={filterUnit.subunit.amount} placeholder="" />
            <date-filter-subunit-options class="flex flex-col overflow-y-auto shrink-0">
                {#each unitChoices as choice}
                    <Radio value={choice.value} bind:group={filterUnit.subunit.unit} label={choice.label} />
                {/each}
            </date-filter-subunit-options>
        {/if}
    </div>
{/if}
