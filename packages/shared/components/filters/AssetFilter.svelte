<script lang="typescript">
    import { TogglableButton, FilterModal } from 'shared/components'
    import { Modal } from 'shared/components'
    import { Filter } from '@core/wallet/interfaces/filter.interface'

    let filter: Filter

    let filterActive = false
    let modal: Modal

    $: filterActive && modal?.toggle()

    function onSetFilters() {
        modal?.toggle()
        filterActive = false
    }
</script>

<div class="relative">
    <TogglableButton icon="firefly" bind:active={filterActive} />

    {#if filterActive}
        <div class="absolute right-60 top-30">
            <FilterModal bind:modal bind:filter {onSetFilters} />
        </div>
    {/if}
</div>
