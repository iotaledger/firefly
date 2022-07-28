<script lang="typescript">
    import { Checkbox } from 'shared/components'

    export let filterItem
</script>

{#if filterItem.type === 'boolean'}
    <Checkbox label={filterItem.label} bind:checked={filterItem.value} />
{/if}
