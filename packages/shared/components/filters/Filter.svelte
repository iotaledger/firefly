<script lang="typescript">
    import { TogglableButton, FilterModal, FilterItem, Modal } from 'shared/components'
    import type { Filter } from '@core/wallet/interfaces/filter.interface'
    import { deepCopy } from '@lib/utils'
    import type { Writable } from 'svelte/store'

    export let filterStore: Writable<Filter>

    let filter: Filter = deepCopy($filterStore)

    let filterActive = false
    let modal: Modal

    $: isChanged = JSON.stringify($filterStore) !== JSON.stringify(filter)

    function onSetFilters(): void {
        $filterStore = deepCopy(filter)
    }

    function onClose(): void {
        filter = deepCopy($filterStore)
    }

    $: filterActive = modal?.isOpened()
</script>

<div class="h-6 relative">
    <TogglableButton icon="filter" bind:active={filterActive} onClick={modal?.toggle} />

    <FilterModal bind:modal bind:filter {isChanged} {onSetFilters} {onClose}>
        {#each Object.keys(filter) as filterUnit}
            <FilterItem bind:filterUnit={filter[filterUnit]} />
        {/each}
    </FilterModal>
</div>
