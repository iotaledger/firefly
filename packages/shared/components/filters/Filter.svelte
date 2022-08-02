<script lang="typescript">
    import { TogglableButton, FilterModal, FilterItem, Modal } from 'shared/components'
    import { Filter } from '@core/wallet/interfaces/filter.interface'
    import { deepCopy } from '@lib/utils'
    import { Writable } from 'svelte/store'

    export let filterStore: Writable<Filter>

    let filter: Filter = deepCopy($filterStore)

    let filterActive = false
    let modal: Modal

    $: filterActive && modal?.toggle()

    function onSetFilters(): void {
        $filterStore = deepCopy(filter)
        filterActive = false
    }

    function onClose(): void {
        filter = deepCopy($filterStore)
        filterActive = false
    }
</script>

<div class="h-6 relative">
    <TogglableButton icon="filter" bind:active={filterActive} />

    <FilterModal bind:modal bind:filter {onSetFilters} {onClose}>
        {#each Object.keys(filter) as filterUnit}
            <FilterItem filterUnit={filter[filterUnit]} />
        {/each}
    </FilterModal>
</div>
