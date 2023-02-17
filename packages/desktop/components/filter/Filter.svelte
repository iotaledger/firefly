<script lang="ts">
    import type { Writable } from 'svelte/store'
    import { TogglableButton, Modal } from '@ui'
    import { FilterItem, FilterModal } from '@components'
    import { deepCopy, Filter } from '@core/utils'

    export let filterStore: Writable<Filter>
    let filter: Filter = deepCopy($filterStore)

    let filterActive = false
    let modal: Modal
    let openFilterItemIndex = -1

    function onSetFilters(): void {
        $filterStore = deepCopy(filter)
        filterActive = false
    }

    function onClose(): void {
        filter = deepCopy($filterStore)
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

    $: isChanged = JSON.stringify($filterStore) !== JSON.stringify(filter)
    $: filterActive = modal?.isOpened()
    $: activeFilterCount = Object.keys($filterStore).filter((f) => $filterStore[f].active).length
</script>

<filter-container class="block h-6 relative">
    <TogglableButton icon="filter" bind:active={filterActive} onClick={modal?.toggle} />
    {#if activeFilterCount}
        <filter-badge
            class="inline-flex items-center justify-center h-3 w-3 -ml-2 -mt-0.5 absolute rounded-full bg-blue-500 text-white text-8"
        >
            {activeFilterCount}
        </filter-badge>
    {/if}
    <FilterModal bind:modal bind:filter {isChanged} {onSetFilters} {onClose}>
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
