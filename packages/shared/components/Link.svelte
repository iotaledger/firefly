<script>
    import { bindEvents } from '@shared-lib/utils'
    export let events = {}

    export let onClick = () => ''
    export let href = undefined
    export let secondary = false
    export let disabled = false
    export let ghost = false
</script>

<style type="text/scss">
    a {
        color: var(--text-highlighted-color); // TODO: tailwindify
    }
</style>

<a
    class="text-12 leading-140 cursor-pointer"
    data-label="link"
    use:bindEvents={events}
    {href}
    on:click={onClick}
    class:secondary
    class:disabled
    class:ghost>
    <slot />
</a>
