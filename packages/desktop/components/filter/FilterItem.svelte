<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import {
        Checkbox,
        Icon,
        DateFilterItem,
        NumberFilterItem,
        SelectionFilterItem,
        AssetFilterItem,
        OrderFilterItem,
        NetworkFilterItem,
    } from '@ui'
    import { localize } from '@core/i18n'
    import { FilterUnit } from '@core/utils/interfaces/filter'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let filterUnit: FilterUnit
    export let isOpen: boolean

    const dispatch = createEventDispatcher()

    function onArrowClick(): void {
        dispatch('toggle')
    }

    function onCheckBoxClick(): void {
        if (filterUnit.active) {
            dispatch('open')
        }
    }
</script>

<filter-item class="block border-t border-solid border-gray-200 dark:border-gray-800">
    <filter-item-toggle class="flex flex-row justify-between px-4 py-2">
        <Checkbox
            label={localize(filterUnit.labelKey ?? filterUnit.localeKey + '.label')}
            bind:checked={filterUnit.active}
            small
            keepSameColor
            onClick={onCheckBoxClick}
        />
        <button on:click={onArrowClick}>
            <Icon
                icon={isOpen ? IconEnum.SmallChevronUp : IconEnum.SmallChevronDown}
                width="16"
                height="16"
                classes="cursor-pointer fill-current text-gray-500 dark:text-white"
            />
        </button>
    </filter-item-toggle>
    {#if isOpen}
        <filter-item-type class="block expanded px-4 py-3 bg-gray-50 dark:bg-transparent">
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
            {:else if filterUnit.type === 'network'}
                <NetworkFilterItem bind:filterUnit />
            {/if}
        </filter-item-type>
    {/if}
</filter-item>

<style lang="scss">
    filter-item {
        :global(box) {
            @apply p-2;
        }

        &:last-child .expanded {
            @apply rounded-b-xl;
        }
    }
</style>
