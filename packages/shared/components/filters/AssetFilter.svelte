<script lang="typescript">
    import { TogglableButton, FilterModal, FilterItem, Modal } from 'shared/components'
    import { AssetFilter } from '@core/wallet/interfaces/filter.interface'
    import { assetFilter } from '@core/wallet/stores/selected-account-assets.store'

    let filter: AssetFilter = { ...$assetFilter }

    let filterActive = false
    let modal: Modal

    $: filterActive && modal?.toggle()

    function onSetFilters() {
        modal?.toggle()
        filterActive = false
        $assetFilter = filter
    }
</script>

<div class="relative">
    <TogglableButton icon="network" bind:active={filterActive} />

    {#if filterActive}
        <div class="absolute right-60 top-30">
            <FilterModal bind:modal bind:filter {onSetFilters}>
                {#each Object.keys(filter) as filterItem}
                    <FilterItem filterItem={filter[filterItem]} />
                {/each}
            </FilterModal>
        </div>
    {/if}
</div>
