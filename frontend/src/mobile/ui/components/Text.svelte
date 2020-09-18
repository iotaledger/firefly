<script>
    import { bindEvents } from '../../lib/utils'
    export let events = {}
</script>

<p use:bindEvents={events}>
    <slot />
</p>
