<script>
    export let width = undefined
    export let height = undefined
    export let classes = ''
</script>

<div
    data-label="box"
    class={`block relative ${classes}`}
    style={`${width ? `width:${width};` : ''}${height ? `height:${height};` : ''}`}>
    <slot />
</div>
