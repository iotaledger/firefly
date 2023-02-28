<script lang="ts">
    import { TogglableButton } from '@ui'
    import { DashboardRoute, dashboardRoute, filterRouter, FilterType } from '@/routers'
    import type { Filter } from '@core/utils/types'
    import { selectedFilter } from '@/contexts/dashboard'
    import { activeProfileId } from '@core/profile'

    export let filterStoreValue: Filter
    export let filterType: FilterType

    function onClick(): void {
        const filter = structuredClone(filterStoreValue)
        $filterRouter.next({ filter, filterType })
    }

    $: activeFilterCount = Object.keys(filterStoreValue).filter((f) => filterStoreValue[f].active).length
    $: isFilterActive = $dashboardRoute === DashboardRoute.Filter && $selectedFilter !== null
    $: $activeProfileId, $filterRouter?.clearFilterStores()
</script>

<div class="h-6 relative">
    <TogglableButton icon="filter" bind:active={isFilterActive} {onClick} />
    {#if activeFilterCount}
        <filter-badge
            class="inline-flex items-center justify-center h-3 w-3 -ml-2 -mt-0.5 absolute rounded-full bg-blue-500 text-white text-8"
        >
            {activeFilterCount}
        </filter-badge>
    {/if}
</div>
