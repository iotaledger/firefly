<script lang="typescript">
    import type { FilterUnit } from '@core/wallet/interfaces'
    import { Checkbox } from 'shared/components'
    import { localize } from '@core/i18n'
    import { DateFilterItem, NumberFilterItem, SelectionFilterItem, AssetFilterItem } from './items'

    export let filterUnit: FilterUnit
</script>

<div class="filter-item border-t border-solid border-gray-200 dark:border-gray-800 ">
    <div class="px-4 py-3">
        <Checkbox
            label={localize(filterUnit.localeKey + '.label')}
            bind:checked={filterUnit.active}
            small
            keepSameColor
        />
    </div>

    {#if filterUnit.active}
        <div class="expanded bg-gray-50 px-4 py-3 dark:bg-transparent">
            {#if filterUnit.type === 'number'}
                <NumberFilterItem bind:filterUnit />
            {:else if filterUnit.type === 'date'}
                <DateFilterItem bind:filterUnit />
            {:else if filterUnit.type === 'selection'}
                <SelectionFilterItem bind:filterUnit />
            {:else if filterUnit.type === 'asset'}
                <AssetFilterItem bind:filterUnit />
            {/if}
        </div>
    {/if}
</div>

<style lang="scss">
    .filter-item {
        :global(box) {
            padding: 0.5rem !important;
        }

        &:last-child {
            .expanded {
                @apply rounded-b-xl;
            }
        }
    }
</style>
