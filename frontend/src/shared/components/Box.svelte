<script>
    export let width = null
    export let height = null
    export let classes = ''
</script>

<box class={classes || 'block'} style={`${width ? `width:${width};` : ''}${height ? `height:${height};` : ''}`}>
    <slot />
</box>
