<script lang="ts">
    import {
        AssetFilterItem,
        DateFilterItem,
        NumberFilterItem,
        OrderFilterItem,
        SelectionFilterItem,
    } from '@components'
    import { FontWeight, Text, Toggle } from '@ui'

    import { localize } from '@core/i18n'
    import { FilterUnit } from '@core/utils/interfaces/filter'
    import { ToggleColor } from '@ui/inputs/Toggle.svelte'

    export let filterUnit: FilterUnit

    function handleToggleClick(): void {
        filterUnit.active = !filterUnit.active
    }
</script>

<filter-item class="block px-5 -mx-5 border-t border-solid border-gray-200 dark:border-gray-800">
    <filter-item-toggle class="flex flex-row justify-between py-4">
        <Text fontWeight={FontWeight.medium} fontSize="15"
            >{localize(filterUnit.labelKey ?? filterUnit.localeKey + '.label')}</Text
        >
        <Toggle onClick={handleToggleClick} bind:active={filterUnit.active} color={ToggleColor.Green} />
    </filter-item-toggle>
    {#if filterUnit.active}
        <filter-item-type
            class="block expanded bg-gray-50 px-4 py-3 -mx-5 dark:bg-transparent border-t border-solid border-gray-200 dark:border-gray-800"
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
    }

    filter-item-type :global(p) {
        @apply font-500 text-14;
    }
</style>
