<script lang="ts">
    import { get } from 'svelte/store'
    import { Text, FontWeight } from '@ui'
    import { localize } from '@core/i18n'
    import { FilterRouter } from '.'
    import { Drawer } from '@components'
    import type { Filter } from '@core/utils/types'
    import { filterRouter } from '@/routers'

    export let filter: Filter
    export let onClose: () => void = () => {}

    let filterRouterComponent: FilterRouter

    $: filterStoreValue = get($filterRouter.getFilterStore())
    $: isChanged = JSON.stringify(filter) !== JSON.stringify(filterStoreValue)
</script>

<Drawer {onClose} fullScreen>
    <filter-drawer class="block">
        <filter-drawer-header class="flex flex-row items-center justify-between pb-6 rounded-t-xl">
            <button type="button" on:click={filterRouterComponent?.clear}>
                <Text fontSize="15" fontWeight={FontWeight.semibold} overrideColor classes="text-gray-500">
                    {localize('actions.clear')}
                </Text>
            </button>
            <Text fontWeight={FontWeight.bold} fontSize="16" classes="text-center flex grow-1">
                {localize('filters.title')}
            </Text>
            <button
                type="button"
                disabled={!isChanged}
                class:opacity-40={!isChanged}
                on:click={filterRouterComponent?.apply}
            >
                <Text fontSize="15" fontWeight={FontWeight.semibold} highlighted>
                    {localize('actions.apply')}
                </Text>
            </button>
        </filter-drawer-header>
        <div>
            <FilterRouter bind:this={filterRouterComponent} bind:filter />
        </div>
    </filter-drawer>
</Drawer>
