<script lang="typescript">
    import { FilterUnit } from '@core/wallet/interfaces/filter.interface'
    import { Checkbox, Dropdown } from 'shared/components'
    import { localize } from '@core/i18n'
    import type { DropdownChoice } from '@core/utils'

    export let filterUnit: FilterUnit

    let choices: DropdownChoice[]
    $: if (filterUnit.type === 'selection') {
        choices = filterUnit.choices.map((choice) => ({
            label: localize(`${filterUnit.localeKey}.${choice}`),
            value: choice,
        }))
    }
</script>

<div class="border-t border-solid border-gray-200 dark:border-gray-800">
    <div class="px-4 py-3">
        <Checkbox
            label={localize(filterUnit.localeKey + '.label')}
            bind:checked={filterUnit.active}
            small
            keepSameColor
        />
    </div>

    {#if filterUnit.active && filterUnit.type !== 'boolean'}
        <div class="bg-gray-50 px-4 py-3">
            {#if filterUnit.type === 'selection'}
                <Dropdown
                    value={localize(`${filterUnit.localeKey}.${filterUnit.selected}`)}
                    items={choices}
                    onSelect={(item) => (filterUnit.type === 'selection' ? (filterUnit.selected = item.value) : null)}
                    small
                />
            {:else}
                <!-- else content here -->
            {/if}
        </div>
    {/if}
</div>
