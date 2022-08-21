<script lang="typescript">
    import { FontWeight } from 'shared/components/Text.svelte'
    import { Modal, Text } from 'shared/components'
    import { Filter } from '@core/wallet/interfaces/filter.interface'
    import { localize } from '@core/i18n'
    import { Button } from 'shared/components'

    export let modal: Modal
    export let filter: Filter
    export let isChanged: boolean
    export let onSetFilters: () => void
    export let onClose: () => void

    function clear(): void {
        for (const key in filter) {
            filter[key].active = false
            filter[key].value = undefined
        }
        onSetFilters()
        modal.toggle()
    }

    function confirm(): void {
        onSetFilters()
        modal.toggle()
    }
</script>

<Modal
    bind:this={modal}
    on:close={onClose}
    position={{ absolute: true, right: '0', top: '30px' }}
    classes="overflow-visible"
>
    <div class="filter-modal">
        <div class="flex flex-row items-center justify-between bg-gray-50 dark:bg-transparent px-4 py-3">
            <Button secondary xsmall onClick={clear}>{localize('actions.clear')}</Button>
            <Text fontWeight={FontWeight.semibold} fontSize="14" classes="text-center flex grow-1"
                >{localize('filters.title')}</Text
            >
            <Button disabled={!isChanged} xsmall onClick={confirm}>{localize('actions.done')}</Button>
        </div>
        <div class="pb-1">
            <slot />
        </div>
    </div>
</Modal>

<style type="text/scss">
    .filter-modal {
        width: 254px;
    }
</style>
