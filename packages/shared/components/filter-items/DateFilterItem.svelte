<script lang="ts">
    import { DateInputButton, Dropdown, Icon, Text, NumberInput } from 'shared/components'
    import { localize } from '@core/i18n'
    import type { IDropdownItem } from '@core/utils'
    import { DateFilterUnit } from '@core/utils/interfaces/filter'
    import { DateFilterOption, DateUnit } from '@core/utils/enums/filters'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let filterUnit: DateFilterUnit

    const choices: IDropdownItem<DateFilterOption>[] = filterUnit.choices.map((choice) => ({
        label: localize(`${filterUnit.localeKey}.${choice}`),
        value: choice,
    }))

    const unitChoices: IDropdownItem<string>[] = Object.keys(DateUnit).map((val) => ({
        label: localize(`${filterUnit.localeKey}.${val}`),
        value: val,
    }))

    function onSelect(item: IDropdownItem<DateFilterOption>): void {
        filterUnit.selected = item.value

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

    function onUnitSelect(item: IDropdownItem<string>): void {
        if (filterUnit.subunit.type === 'unit') {
            filterUnit.subunit.unit = <DateUnit>item.value
        }
    }
</script>

<Dropdown value={filterUnit.selected} items={choices} {onSelect} small />

{#if filterUnit.selected}
    <div class="flex flex-row items-center space-x-2 mt-2">
        {#if filterUnit.selected !== DateFilterOption.Range}
            <Icon height="24" width="20" icon={IconEnum.ArrowRight} />
        {/if}
        {#if filterUnit.subunit.type === 'range'}
            <!-- negative right margin prevents dates from wrapping to a second row unless length is MM.DD.YYYY -->
            <div class="flex items-center flex-wrap gap-2 -mr-1">
                <DateInputButton bind:value={filterUnit.subunit.start} />
                <Text>{localize('general.and')}</Text>
                <DateInputButton bind:value={filterUnit.subunit.end} />
            </div>
        {:else if filterUnit.subunit.type === 'single'}
            <DateInputButton bind:value={filterUnit.subunit.value} />
        {:else if filterUnit.subunit.type === 'unit'}
            <NumberInput bind:value={filterUnit.subunit.amount} placeholder="" />
            <Dropdown value={filterUnit.subunit.unit} items={unitChoices} onSelect={onUnitSelect} small />
        {/if}
    </div>
{/if}
