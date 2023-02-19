<script lang="ts">
    import { FilterAction } from '@/contexts/dashboard'
    import { FilterRoute, filterRoute, filterRouter } from '../../../../lib/routers'
    import { FilterView } from './views'
    import type { Filter } from '@core/utils/types'

    export let filter: Filter

    export function apply(): void {
        $filterRouter.next({ action: FilterAction.Apply, filter })
    }

    export function clear(): void {
        for (const key in filter) {
            filter[key].active = false
            filter[key].value = undefined
        }
        $filterRouter.next({ action: FilterAction.Clear })
    }
</script>

{#if $filterRoute === FilterRoute.Filter}
    <FilterView bind:filter />
{/if}
