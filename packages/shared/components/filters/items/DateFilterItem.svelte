<script lang="typescript">
    import type { DateFilterUnit } from '@core/wallet/interfaces'
    import { DateInputButton, Dropdown, Icon, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import type { DropdownChoice } from '@core/utils'
    import { DateFilterOption } from '@core/wallet'

    export let filterUnit: DateFilterUnit

    const choices: DropdownChoice[] = filterUnit.choices.map((choice) => ({
        label: localize(`${filterUnit.localeKey}.${choice}`),
        value: choice,
    }))

    $: value = localize(`${filterUnit.localeKey}.${filterUnit.selected}`)

    function updateSubUnitForNumberFilter() {
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
                amount: '',
                unit: 'days',
            }
        }
    }

    function onSelect(item) {
        filterUnit.selected = item.value
        updateSubUnitForNumberFilter()
    }
</script>

<Dropdown {value} items={choices} {onSelect} small />

{#if filterUnit.selected}
    <div class="flex flex-row items-center space-x-2 mt-2">
        <Icon height="24" width="20" icon="arrow-right" />
        {#if filterUnit.subunit.type === 'range'}
            <DateInputButton bind:value={filterUnit.subunit.start} autofocus placeholder="" />
            <Text>{localize('general.and')}</Text>
            <DateInputButton bind:value={filterUnit.subunit.end} placeholder="" />
        {:else if filterUnit.subunit.type === 'single'}
            <DateInputButton bind:value={filterUnit.subunit.value} autofocus placeholder="" />
        {/if}
    </div>
{/if}
