<script>
    export let width = null
    export let height = null
    export let classes = ''
    export let anchor = undefined
    export let type = undefined
</script>

{#if type === 'section'}
    <section
        {anchor}
        class={`block relative ${classes}`}
        style={`${width ? `width:${width};` : ''}${height ? `height:${height};` : ''}`}>
        <slot />
    </section>
{:else}
    <box
        {anchor}
        class={`block relative ${classes}`}
        style={`${width ? `width:${width};` : ''}${height ? `height:${height};` : ''}`}>
        <slot />
    </box>
{/if}
