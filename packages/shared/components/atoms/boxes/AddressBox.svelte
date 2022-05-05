<script lang="typescript">
    import Box from './Box.svelte'
    import { Text } from 'shared/components'

    export let address = ''
    export let clearBackground = false
    export let classes = ''
</script>

{#if address}
    <Box col {clearBackground} {classes}>
        <Text type="pre" fontSize="base">
            {address.slice(0, address.length / 2)}
        </Text>
        <Text type="pre" fontSize="base">
            {address.slice(address.length / 2)}
        </Text>
    </Box>
{/if}
