<script>
    import { bindEvents } from '@shared-lib/utils'
    export let events = {}

    export let onClick = () => ''
    export let secondary = false
    export let disabled = false
    export let ghost = false
    export let classes = null
</script>

<button class={classes} use:bindEvents={events} on:click={onClick} class:secondary class:disabled class:ghost>
    <slot />
</button>
