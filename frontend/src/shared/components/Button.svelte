<script>
    import { bindEvents } from '@shared-lib/utils'
    import { Icon, Box } from '@shared-components'
    export let events = {}

    export let onClick = () => ''
    export let secondary = false
    export let disabled = false
    export let active = false
    export let ghost = false
    export let icon = null
    export let classes = null
</script>

<button
    class={classes}
    use:bindEvents={events}
    on:click={onClick}
    class:secondary
    class:disabled
    class:icon
    class:ghost
    class:active>
    {#if icon}
        <Box classes="flex flex-row justify-between">
            <Box classes="flex items-center flex-1">
                <Icon classes="mr-4" {icon} />
                <slot />
            </Box>
            <Icon icon="arrow-right" />
        </Box>
    {:else}
        <slot />
    {/if}
</button>
