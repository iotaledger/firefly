<script lang="typescript">
    import { NumberFilterType, FilterUnit } from '@core/wallet/interfaces/filter.interface'
    import { NumberInput, Checkbox, Dropdown, Icon, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import type { DropdownChoice } from '@core/utils'

    export let filterUnit: FilterUnit

    let choices: DropdownChoice[]
    $: if (filterUnit.type === 'selection' || filterUnit.type === 'number') {
        choices = filterUnit.choices.map((choice) => ({
            label: localize(`${filterUnit.localeKey}.${choice}`),
            value: choice,
        }))
    }

    function updateSubUnitForNumberFilter() {
        if (filterUnit.type === 'number') {
            if (
                filterUnit.selected === NumberFilterType.Equal ||
                filterUnit.selected === NumberFilterType.Greater ||
                filterUnit.selected === NumberFilterType.Less
            ) {
                filterUnit.subunit = {
                    type: 'single',
                    amount: '',
                }
            } else if (filterUnit.selected === NumberFilterType.Range) {
                filterUnit.subunit = {
                    type: 'range',
                    start: '',
                    end: '',
                }
            }
        }
    }

    function onSelect(item) {
        if (filterUnit.type === 'selection' || filterUnit.type === 'number') {
            filterUnit.selected = item.value
            updateSubUnitForNumberFilter()
        }
    }
</script>

<div class="filter-item border-t border-solid border-gray-200 dark:border-gray-800">
    <div class="px-4 py-3">
        <Checkbox
            label={localize(filterUnit.localeKey + '.label')}
            bind:checked={filterUnit.active}
            small
            keepSameColor
        />
    </div>

    {#if filterUnit.active}
        <div class="bg-gray-50 px-4 py-3 dark:bg-transparent">
            <Dropdown
                value={localize(`${filterUnit.localeKey}.${filterUnit.selected}`)}
                items={choices}
                {onSelect}
                small
            />

            {#if filterUnit.type === 'number' && filterUnit.selected}
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
        </div>
    {/if}
</div>

<style lang="scss">
    .filter-item {
        :global(box) {
            padding: 0.5rem !important;
        }
    }
</style>
