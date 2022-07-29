<script lang="typescript">
    import { Checkbox } from 'shared/components'

    export let filterItem
</script>

<div class="px-4 py-3">
    {#if filterItem.type === 'boolean'}
        <Checkbox label={filterItem.label} bind:checked={filterItem.active} />
    {/if}
</div>
