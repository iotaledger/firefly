<script lang="ts">
    import { slide } from 'svelte/transition'
    import { FontWeight, Text, Toggle } from '@ui'
    import { localize } from '@core/i18n'
    import {
        DateFilterItem,
        NumberFilterItem,
        SelectionFilterItem,
        AssetFilterItem,
        OrderFilterItem,
    } from 'shared/components/filters/items'
    import { FilterUnit } from '@core/utils/interfaces/filter'

    export let filterUnit: FilterUnit
</script>

<filter-item class="block px-5 -mx-5 border-t border-solid border-gray-200 dark:border-gray-800">
    <filter-item-toggle class="block py-4 flex flex-row justify-between">
        <Text fontWeight={FontWeight.medium} fontSize="15"
            >{localize(filterUnit.labelKey ?? filterUnit.localeKey + '.label')}</Text
        >
        <Toggle
            onClick={() => (filterUnit.active = !filterUnit.active)}
            bind:active={filterUnit.active}
            color="green"
        />
    </filter-item-toggle>
    {#if filterUnit.active}
        <filter-item-type
            class="block expanded bg-gray-50 px-4 py-3 -mx-5 dark:bg-transparent border-t border-solid border-gray-200 dark:border-gray-800"
            transition:slide
        >
            {#if filterUnit.type === 'number'}
                <NumberFilterItem bind:filterUnit />
            {:else if filterUnit.type === 'date'}
                <DateFilterItem bind:filterUnit />
            {:else if filterUnit.type === 'selection'}
                <SelectionFilterItem bind:filterUnit />
            {:else if filterUnit.type === 'order'}
                <OrderFilterItem bind:filterUnit />
            {:else if filterUnit.type === 'asset'}
                <AssetFilterItem bind:filterUnit />
            {/if}
        </filter-item-type>
    {/if}
</filter-item>

<style lang="scss">
    filter-item:last-of-type {
        @apply border-b;
        @apply border-solid;
        @apply border-gray-200;
        @apply dark:border-gray-800;
    }

    filter-item-type :global(p) {
        @apply text-14;
        @apply font-500;
    }
</style>
