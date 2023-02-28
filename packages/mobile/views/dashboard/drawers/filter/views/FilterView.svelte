<script lang="ts">
    import type { Filter } from '@core/utils/types'
    import { FilterItem } from '@components'

    export let filter: Filter
</script>

{#each Object.keys(filter) as filterUnit}
    <FilterItem bind:filterUnit={filter[filterUnit]} />
{/each}
