<script lang="typescript">
    import type { FilterUnit } from '@core/wallet/interfaces'
    import { Checkbox, Icon } from 'shared/components'
    import { localize } from '@core/i18n'
    import { DateFilterItem, NumberFilterItem, SelectionFilterItem, AssetFilterItem } from './items'
    import { createEventDispatcher } from 'svelte'

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

<div class="filter-item border-t border-solid border-gray-200 dark:border-gray-800 ">
    <div class="px-4 py-3 flex flex-row justify-between">
        <Checkbox
            label={localize(filterUnit.localeKey + '.label')}
            bind:checked={filterUnit.active}
            small
            keepSameColor
            onClick={onCheckBoxClick}
        />
        <button on:click={onArrowClick}>
            <Icon
                icon={isOpen ? 'small-chevron-up' : 'small-chevron-down'}
                width="16"
                height="16"
                classes="cursor-pointer fill-current text-gray-500 dark:text-white"
            />
        </button>
    </div>

    {#if isOpen}
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
