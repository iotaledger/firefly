<script lang="typescript">
    import { TogglableButton, FilterModal, FilterItem, Modal } from 'shared/components'
    import { ActivityFilter } from '@core/wallet/interfaces/filter.interface'
    import { activityFilter } from '@core/wallet/stores/selected-account-activities.store'

    let filter: ActivityFilter = { ...$activityFilter }

    let filterActive = false
    let modal: Modal

    $: filterActive && modal?.toggle()

    function onSetFilters() {
        modal?.toggle()
        filterActive = false
        $activityFilter = filter
    }
</script>

<div class="relative">
    <TogglableButton icon="network" bind:active={filterActive} />

    {#if filterActive}
        <div class="absolute right-60 top-30">
            <FilterModal bind:modal bind:filter {onSetFilters}>
                <FilterItem filterItem={filter.showHidden} />
            </FilterModal>
        </div>
    {/if}
</div>
