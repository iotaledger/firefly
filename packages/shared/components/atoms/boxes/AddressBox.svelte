<script lang="typescript">
    import Box from './Box.svelte'
    import { Text } from 'shared/components'

    export let address: string = ''
    export let clearBackground: false
    export let classes: string = ''
</script>

{#if address}
    <button>
        <Box col {clearBackground} {classes} {...$$restProps}>
            <Text type="pre" fontSize="base">
                {address.slice(0, address.length / 2)}
            </Text>
            <Text type="pre" fontSize="base">
                {address.slice(address.length / 2)}
            </Text>
        </Box>
    </button>
{/if}
