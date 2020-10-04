<script>
    import { Logo, Box } from '@shared-components'
    export let allowBack = true
</script>

<Box classes="w-full h-full flex flex-row">
    <Box width="430px" classes="flex flex-col flex-shrink-0 justify-between pt-12 pb-16 px-12 w-2/6">
        <Box classes="flex flex-col">
            <Box classes="w-full mb-10">
                {#if !allowBack}
                    <Logo width="64px" logo="logo-firefly" />
                {/if}
            </Box>
            <slot name="leftpane__content" />
        </Box>
        <slot name="leftpane__action" />
    </Box>
    <slot name="rightpane" />
</Box>
