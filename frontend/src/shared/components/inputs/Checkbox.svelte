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
    }
    :global(checkbox-input svg path) {
        fill: #c9d6ec;
    }
    :global(checkbox-input svg.active path) {
        fill: #108cff;
    }
</style>

<checkbox-input
    on:click={() => {
        checked = !checked
    }}>
    <Icon icon="checkbox" classes={`mr-3 ${checked ? 'active' : ''}`} />
    <Text type="p" secondary={true}>{label}</Text>
</checkbox-input>
