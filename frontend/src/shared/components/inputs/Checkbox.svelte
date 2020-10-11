<script>
    import { Icon, Text } from '@shared-components'

    export let label
    export let checked
</script>

<style type="text/scss">
    checkbox-input {
        display: flex;
        align-items: center;
        cursor: pointer;
        :global(svg path) {
            fill: #c9d6ec;
        }
        :global(svg.active path) {
            fill: #108cff;
        }
    }
</style>

<checkbox-input
    on:click={() => {
        checked = !checked
    }}>
    <Icon icon="checkbox" classes={`mr-3 ${checked ? 'active' : ''}`} />
    <Text type="p" secondary>{label}</Text>
</checkbox-input>
