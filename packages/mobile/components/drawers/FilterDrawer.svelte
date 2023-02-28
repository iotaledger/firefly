<script lang="ts">
    import { onMount } from 'svelte'
    import { Writable } from 'svelte/store'

    import { FilterItem } from '@components'
    import { FontWeight, Text } from '@ui'

    import { localize } from '@core/i18n'
    import { deepCopy } from '@core/utils'
    import { Filter } from '@core/utils/types'

    import { closeDrawer, DrawerId } from '@/auxiliary/drawer'
    import { FilterType, getFilterStore } from '@/contexts/wallet'

    export let filterType: FilterType

    let filterStore: Writable<Filter>
    let filter: Filter

    $: isChanged = isFilterChanged($filterStore, filter)

    onMount(() => {
        filterStore = getFilterStore(filterType)
        filter = deepCopy($filterStore)
    })

    function _closeDrawer(): void {
        closeDrawer(DrawerId.Filter)
    }

    function handleApply(): void {
        $filterStore = deepCopy(filter)
        _closeDrawer()
    }

    function handleClear(): void {
        for (const key in filter) {
            filter[key].active = false
            filter[key].value = undefined
        }
    }

    function isFilterChanged(originalFilter: Filter, filter: Filter): boolean {
        if (filter) {
            const oldHasActiveFilters = Object.keys(originalFilter).some((key) => originalFilter[key].active)
            const newHasActiveFilters = Object.keys(filter).some((key) => filter[key].active)

            const stayedDeactivated = !oldHasActiveFilters && !newHasActiveFilters
            const isDifferent = JSON.stringify(originalFilter) !== JSON.stringify(filter)
            return isDifferent && !stayedDeactivated
        }
    }
</script>

<filter-drawer class="flex flex-col w-full space-y-6 max-h-full">
    <filter-drawer-header class="flex flex-row items-center justify-between">
        <button type="button" on:click={handleClear}>
            <Text fontSize="15" fontWeight={FontWeight.semibold} overrideColor classes="text-gray-500">
                {localize('actions.clear')}
            </Text>
        </button>
        <Text fontWeight={FontWeight.bold} fontSize="16" classes="text-center flex grow-1">
            {localize('filters.title')}
        </Text>
        <button type="button" disabled={!isChanged} class:opacity-40={!isChanged} on:click={handleApply}>
            <Text fontSize="15" fontWeight={FontWeight.semibold} highlighted>
                {localize('actions.apply')}
            </Text>
        </button>
    </filter-drawer-header>
    {#if filter}
        <filter-drawer-content class="px-1 w-full overflow-y-auto overflow-x-hidden flex flex-col flex-auto">
            {#each Object.keys(filter) as filterUnit}
                <FilterItem bind:filterUnit={filter[filterUnit]} />
            {/each}
        </filter-drawer-content>
    {/if}
</filter-drawer>
