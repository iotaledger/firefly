<script lang="typescript">
    import type { DateFilterUnit } from '@core/wallet/interfaces'
    import { DateInputButton, Dropdown, Icon, Text, NumberInput } from 'shared/components'
    import { localize } from '@core/i18n'
    import type { DropdownChoice } from '@core/utils'
    import { DateFilterOption, DateUnit } from '@core/wallet'

    export let filterUnit: DateFilterUnit

    const choices: DropdownChoice[] = filterUnit.choices.map((choice) => ({
        label: localize(`${filterUnit.localeKey}.${choice}`),
        value: choice,
    }))

    const unitChoices: DropdownChoice[] = Object.keys(DateUnit).map((val) => ({
        label: localize(`${filterUnit.localeKey}.${val}`),
        value: val,
    }))

    $: selectedDateFilterOption = localize(`${filterUnit.localeKey}.${filterUnit.selected}`)
    $: selectedDateUnit =
        filterUnit.subunit.type === 'unit' ? localize(`${filterUnit.localeKey}.${filterUnit.subunit.unit}`) : ''

    function onSelect(item): void {
        filterUnit.selected = item.value

        if (
            filterUnit.selected === DateFilterOption.Equals ||
            filterUnit.selected === DateFilterOption.After ||
            filterUnit.selected === DateFilterOption.AfterOrEquals ||
            filterUnit.selected === DateFilterOption.Before
        ) {
            filterUnit.subunit = {
                type: 'single',
                value: undefined,
            }
        } else if (filterUnit.selected === DateFilterOption.Range) {
            filterUnit.subunit = {
                type: 'range',
                start: undefined,
                end: undefined,
            }
        } else if (filterUnit.selected === DateFilterOption.Last) {
            filterUnit.subunit = {
                type: 'unit',
                amount: '0',
                unit: DateUnit.Days,
            }
        }
    }

    function onUnitSelect(item): void {
        if (filterUnit.subunit.type === 'unit') {
            filterUnit.subunit.unit = item.value
        }
    }
</script>

<Dropdown value={selectedDateFilterOption} items={choices} {onSelect} small />

{#if filterUnit.selected}
    <div class="flex flex-row items-center space-x-2 mt-2">
        {#if filterUnit.selected !== DateFilterOption.Range}
            <Icon height="24" width="20" icon="arrow-right" />
        {/if}
        {#if filterUnit.subunit.type === 'range'}
            <DateInputButton bind:value={filterUnit.subunit.start} />
            <Text>{localize('general.and')}</Text>
            <DateInputButton bind:value={filterUnit.subunit.end} />
        {:else if filterUnit.subunit.type === 'single'}
            <DateInputButton bind:value={filterUnit.subunit.value} />
        {:else if filterUnit.subunit.type === 'unit'}
            <NumberInput bind:value={filterUnit.subunit.amount} placeholder="" />
            <Dropdown value={selectedDateUnit} items={unitChoices} onSelect={onUnitSelect} small />
        {/if}
    </div>
{/if}
