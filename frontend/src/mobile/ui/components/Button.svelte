<script>
    import { bindEvents } from '../../lib/utils'
    export let events = {}
</script>

<button use:bindEvents={events}>
    <slot />
</button>
