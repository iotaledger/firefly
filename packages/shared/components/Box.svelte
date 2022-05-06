<script lang="typescript">
    export let width = undefined
    export let height = undefined
    export let classes = ''
</script>

<div
    on:click
    data-label="box"
    class={`block relative ${classes}`}
    style={`${width ? `width:${width};` : ''}${height ? `height:${height};` : ''}`}
    {...$$restProps}
>
    <slot />
</div>
