<script lang="ts">
    import { Dropdown, Icon, Text, NumberInput } from 'shared/components'
    import { localize } from '@core/i18n'
    import type { IDropdownItem } from '@core/utils'
    import { NumberFilterUnit } from '@core/utils/interfaces/filter'
    import { NumberFilterOption } from '@core/utils/enums/filters'

    export let filterUnit: NumberFilterUnit

    const choices: IDropdownItem<NumberFilterOption>[] = filterUnit.choices.map((choice) => ({
        label: localize(`${filterUnit.localeKey}.${choice}`),
        value: choice,
    }))

    $: value = localize(`${filterUnit.localeKey}.${filterUnit.selected}`)

    function onSelect(item: IDropdownItem<NumberFilterOption>): void {
        filterUnit.selected = item.value

        switch (filterUnit.selected) {
            case NumberFilterOption.Equal:
            case NumberFilterOption.Greater:
            case NumberFilterOption.Less:
                filterUnit.subunit = {
                    type: 'single',
                    amount: '',
                }
                break
            case NumberFilterOption.Range:
                filterUnit.subunit = {
                    type: 'range',
                    start: '',
                    end: '',
                }
                break
        }
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
