<script lang="typescript">
    import { TogglableButton, FilterModal, FilterItem, Modal } from 'shared/components'
    import type { Filter } from '@core/wallet/interfaces/filter.interface'
    import { deepCopy } from '@lib/utils'
    import type { Writable } from 'svelte/store'

    export let filterStore: Writable<Filter>

    let filter: Filter = deepCopy($filterStore)

    let filterActive = false
    let modal: Modal

    function onSetFilters(): void {
        $filterStore = deepCopy(filter)
        filterActive = false
    }

    function onClose(): void {
        filter = deepCopy($filterStore)
        filterActive = false
    }

    $: isChanged = JSON.stringify($filterStore) !== JSON.stringify(filter)
    $: filterActive = modal?.isOpened()
    $: activeFilterCount = Object.keys($filterStore).filter((f) => $filterStore[f].active).length
    $: totalFilterCount = Object.keys($filterStore).length
</script>

<div class="h-6 relative">
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
            <FilterItem bind:filterUnit={filter[filterUnit]} last={index === totalFilterCount - 1} />
        {/each}
    </FilterModal>
</div>
