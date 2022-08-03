<script lang="typescript">
    import { FilterUnit } from '@core/wallet/interfaces/filter.interface'
    import { Checkbox, Dropdown } from 'shared/components'
    import { localize } from '@core/i18n'

    export let filterUnit: FilterUnit

    let choices
    $: if (filterUnit.type === 'selection') {
        const prefix = filterUnit.translationPrefix
        choices = filterUnit.choices.map((choice) => ({ label: localize(`${prefix}.${choice}`), value: choice }))
    }
</script>

<div class="border-t border-solid border-gray-200 dark:border-gray-800">
    <div class="px-4 py-3">
        <Checkbox label={localize(filterUnit.label)} bind:checked={filterUnit.active} small keepSameColor />
    </div>

    {#if filterUnit.active && filterUnit.type !== 'boolean'}
        <div class="bg-gray-50 px-4 py-3">
            {#if filterUnit.type === 'selection'}
                <Dropdown
                    value={localize(`${filterUnit.translationPrefix}.${filterUnit.selected}`)}
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
