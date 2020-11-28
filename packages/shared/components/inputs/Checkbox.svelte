<script>
    import { Icon, Text } from '@shared-components'

    export let label = undefined
    export let checked = false
</script>

<style type="text/scss">
    div {
        :global(svg path) {
            fill: var(--text-disabled-color);
        }
        :global(svg.active path) {
            fill: var(--ui-blue-color);
        }
    }
</style>

<div
    data-label="checkbox-input"
    class="flex items-center cursor-pointer"
    on:click={() => {
        checked = !checked
    }}>
    <Icon icon="checkbox" classes={`mr-3 ${checked ? 'active' : ''}`} />
    <Text type="p" secondary>{label}</Text>
</div>
