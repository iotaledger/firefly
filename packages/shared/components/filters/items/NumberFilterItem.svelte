<script lang="typescript">
    import type { NumberFilterUnit } from '@core/wallet/interfaces'
    import { Dropdown, Icon, Text, NumberInput } from 'shared/components'
    import { localize } from '@core/i18n'
    import type { DropdownChoice } from '@core/utils'
    import { NumberFilterOption } from '@core/wallet'

    export let filterUnit: NumberFilterUnit

    const choices: DropdownChoice[] = filterUnit.choices.map((choice) => ({
        label: localize(`${filterUnit.localeKey}.${choice}`),
        value: choice,
    }))

    $: value = localize(`${filterUnit.localeKey}.${filterUnit.selected}`)

    function updateSubUnitForNumberFilter() {
        if (
            filterUnit.selected === NumberFilterOption.Equal ||
            filterUnit.selected === NumberFilterOption.Greater ||
            filterUnit.selected === NumberFilterOption.Less
        ) {
            filterUnit.subunit = {
                type: 'single',
                amount: '',
            }
        } else if (filterUnit.selected === NumberFilterOption.Range) {
            filterUnit.subunit = {
                type: 'range',
                start: '',
                end: '',
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
            <NumberInput bind:value={filterUnit.subunit.start} autofocus placeholder="" />
            <Text>{localize('general.and')}</Text>
            <NumberInput bind:value={filterUnit.subunit.end} placeholder="" />
        {:else}
            <NumberInput bind:value={filterUnit.subunit.amount} autofocus placeholder="" />
        {/if}
    </div>
{/if}
