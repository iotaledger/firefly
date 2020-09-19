<script>
    export let width = null
    export let height = null
    export let classes = ''
</script>

<div class={classes} style={`${width ? `width:${width};` : ''}${height ? `height:${height};` : ''}`}>
    <slot />
</div>
