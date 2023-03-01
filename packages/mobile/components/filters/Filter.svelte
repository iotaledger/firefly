<script lang="ts">
    import { Icon } from '@ui'

    import type { Filter } from '@core/utils/types'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'

    import { DrawerId, openDrawer } from '@/auxiliary/drawer'
    import { FilterType } from '@/contexts/wallet'

    export let filterStoreValue: Filter
    export let filterType: FilterType

    function onClick(): void {
        openDrawer(DrawerId.Filter, { filterType, fullScreen: true })
    }

    $: activeFilterCount = Object.keys(filterStoreValue).filter((f) => filterStoreValue[f].active).length
</script>

<div class="h-6 relative">
    <button on:click={onClick} class="text-gray-500 dark:text-white">
        <Icon icon={IconEnum.Filter} />
    </button>
    {#if activeFilterCount}
        <filter-badge
            class="inline-flex items-center justify-center h-3 w-3 -ml-2 -mt-0.5 absolute rounded-full bg-blue-500 text-white text-8"
        >
            {activeFilterCount}
        </filter-badge>
    {/if}
</div>
