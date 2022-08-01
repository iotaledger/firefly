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
    // $: filterActive, filter = deepCopy($assetFilter)

    function onSetFilters() {
        $filterStore = deepCopy(filter)
        filterActive = false
    }

    function onClose() {
        filter = deepCopy($filterStore)
        filterActive = false
    }
</script>

<div class="relative">
    <TogglableButton icon="filter" bind:active={filterActive} />

    <FilterModal bind:modal bind:filter {onSetFilters} {onClose}>
        {#each Object.keys(filter) as filterItem}
            <FilterItem filterItem={filter[filterItem]} />
        {/each}
    </FilterModal>
</div>
