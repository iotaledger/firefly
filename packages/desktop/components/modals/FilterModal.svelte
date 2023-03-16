<script lang="ts">
    import { Modal, Text, FontWeight, Button, ButtonSize } from '@ui'
    import { localize } from '@core/i18n'
    import { Filter } from '@core/utils/types'

    export let modal: Modal = undefined
    export let filter: Filter
    export let isChanged: boolean
    export let setFilters: () => void
    export let closeFilters: () => void

    function onClearClick(): void {
        for (const key in filter) {
            filter[key].active = false
            filter[key].value = undefined
        }
        setFilters()
    }

    function onConfirmClick(): void {
        setFilters()
        modal.toggle()
    }
</script>

<Modal
    bind:this={modal}
    on:close={closeFilters}
    position={{ absolute: true, right: '0', top: '30px' }}
    classes="overflow-visible"
>
    <filter-modal>
        <filter-modal-header
            class="flex flex-row items-center justify-between bg-gray-50 dark:bg-transparent px-4 py-2 rounded-t-xl"
        >
            <Button outline size={ButtonSize.Small} onClick={onClearClick}>
                {localize('actions.clear')}
            </Button>
            <Text fontWeight={FontWeight.semibold} fontSize="14" classes="text-center flex grow-1">
                {localize('filters.title')}
            </Text>
            <Button disabled={!isChanged} size={ButtonSize.Small} onClick={onConfirmClick}>
                {localize('actions.apply')}
            </Button>
        </filter-modal-header>
        <filter-modal-slot class="block">
            <slot />
        </filter-modal-slot>
    </filter-modal>
</Modal>

<style lang="scss">
    filter-modal {
        @apply block w-64;
        border-radius: inherit;
    }
</style>
