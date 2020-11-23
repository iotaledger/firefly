<script>
    import { bindEvents } from '@shared-lib/utils'
    export let events = {}

    export let onClick = () => ''
    export let href = null
    export let secondary = false
    export let disabled = false
    export let ghost = false
</script>

<a use:bindEvents={events} {href} on:click={onClick} class:secondary class:disabled class:ghost>
    <slot />
</a>
