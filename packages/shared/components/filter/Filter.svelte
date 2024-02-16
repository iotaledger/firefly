<script lang="ts">
    import type { Writable } from 'svelte/store'
    import { TogglableButton, Modal, FilterItem, FilterModal } from '@ui'
    import { Filter } from '@core/utils'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let filterStore: Writable<Filter>
    let filter: Filter = structuredClone($filterStore)

    let filterActive = false
    let modal: Modal
    let openFilterItemIndex = -1

    function setFilters(): void {
        $filterStore = structuredClone(filter)
        filterActive = false
    }

    function closeFilters(): void {
        filter = structuredClone($filterStore)
        filterActive = false
    }

    function toggleFilterItem(index: number): void {
        if (openFilterItemIndex === index) {
            openFilterItemIndex = -1
        } else {
            openFilterItem(index)
        }
    }

    function openFilterItem(index: number): void {
        openFilterItemIndex = index
    }

    $: isChanged = isFilterChanged($filterStore, filter)
    $: filterActive = modal?.isOpened()
    $: activeFilterCount = Object.keys($filterStore).filter((f) => $filterStore[f].active).length

    function isFilterChanged(originalFilter: Filter, filter: Filter): boolean {
        const oldHasActiveFilters = Object.keys(originalFilter).some((key) => originalFilter[key].active)
        const newHasActiveFilters = Object.keys(filter).some((key) => filter[key].active)

        const stayedDeactivated = !oldHasActiveFilters && !newHasActiveFilters
        const isDifferent = JSON.stringify(originalFilter) !== JSON.stringify(filter)
        return isDifferent && !stayedDeactivated
    }
</script>

<filter-container class="block h-6 relative">
    <TogglableButton icon={IconEnum.Filter} bind:active={filterActive} onClick={modal?.toggle} />
    {#if activeFilterCount}
        <filter-badge
            class="inline-flex items-center justify-center h-3 w-3 -ml-2 -mt-0.5 absolute rounded-full bg-blue-500 text-white text-8"
        >
            {activeFilterCount}
        </filter-badge>
    {/if}
    <FilterModal bind:modal bind:filter {isChanged} {setFilters} {closeFilters}>
        {#each Object.keys(filter) as filterUnit, index}
            <FilterItem
                bind:filterUnit={filter[filterUnit]}
                on:toggle={() => toggleFilterItem(index)}
                on:open={() => openFilterItem(index)}
                isOpen={openFilterItemIndex === index}
            />
        {/each}
    </FilterModal>
</filter-container>
