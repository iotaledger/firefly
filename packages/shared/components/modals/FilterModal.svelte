<script lang="typescript">
    import { FontWeightNumber } from 'shared/components/Text.svelte'
    import { Modal, Text } from 'shared/components'
    import { Filter } from '@core/wallet/interfaces/filter.interface'

    export let modal: Modal
    export let filter: Filter
    export let onSetFilters

    const copy: Filter = { ...filter }

    function clear() {
        for (const key in filter) {
            filter[key] = false
        }
        onSetFilters()
    }

    function confirm() {
        filter = { ...copy }
        onSetFilters()
    }
</script>

<Modal bind:this={modal}>
    <div class="filter-modal">
        <div class="flex flex-row items-center justify-between bg-gray-50 px-4 py-3">
            <button
                class="action py-1 px-2 border border-solid border-gray-300 text-center rounded-4 w-fit font-normal text-13 bg-white hover:bg-blue-200"
                on:click|stopPropagation={clear}
            >
                Clear
            </button>
            <Text fontWeight={FontWeightNumber._600} fontSize="13" classes="text-center flex grow-1">Filters</Text>
            <button
                class="action py-1 px-3 text-center rounded-4 w-fit font-normal text-13 text-white bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400"
                on:click|stopPropagation={confirm}
            >
                Done
            </button>
        </div>
        <div>
            <slot />
        </div>
    </div>
</Modal>

<style type="text/scss">
    .filter-modal {
        width: 254px;
    }
</style>
