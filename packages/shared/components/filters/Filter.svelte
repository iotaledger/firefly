<script lang="typescript">
    import { TogglableButton, FilterModal, FilterItem, Modal } from 'shared/components'
    import { Filter } from '@core/wallet/interfaces/filter.interface'
    import { assetFilter } from '@core/wallet/stores/selected-account-assets.store'
    import { deepCopy } from '@lib/utils'
    import { Writable } from 'svelte/store'

    export let filterStore: Writable<Filter>

    const filter: Filter = deepCopy($filterStore)

    let filterActive = false
    let modal: Modal

    $: filterActive && modal?.toggle()
    // $: filterActive, filter = deepCopy($assetFilter)

    function onSetFilters() {
        modal?.toggle()
        $filterStore = deepCopy(filter)
        filterActive = false
    }
</script>

<div class="relative">
    <TogglableButton icon="filter" bind:active={filterActive} />

    <FilterModal bind:modal bind:filter={$assetFilter} {onSetFilters}>
        {#each Object.keys(filter) as filterItem}
            <FilterItem filterItem={filter[filterItem]} />
        {/each}
    </FilterModal>
</div>
