<script lang="typescript">
    import { Modal, Text, FontWeight, Button, ButtonSize } from 'shared/components'
    import type { Filter } from '@core/wallet'
    import { localize } from '@core/i18n'
    import { activeProfileId } from '@core/profile'

    export let modal: Modal = undefined
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
    }

    function confirm(): void {
        onSetFilters()
        modal.toggle()
    }

    $: $activeProfileId, clear()
</script>

<Modal
    bind:this={modal}
    on:close={onClose}
    position={{ absolute: true, right: '0', top: '30px' }}
    classes="overflow-visible"
>
    <div class="filter-modal">
        <div class="flex flex-row items-center justify-between bg-gray-50 dark:bg-transparent px-4 py-3 rounded-t-xl">
            <Button outline size={ButtonSize.Small} onClick={clear}>{localize('actions.clear')}</Button>
            <Text fontWeight={FontWeight.semibold} fontSize="14" classes="text-center flex grow-1"
                >{localize('filters.title')}</Text
            >
            <Button disabled={!isChanged} size={ButtonSize.Small} onClick={confirm}>{localize('actions.apply')}</Button>
        </div>
        <div>
            <slot />
        </div>
    </div>
</Modal>

<style type="text/scss">
    .filter-modal {
        border-radius: inherit;
        width: 254px;
    }
</style>
