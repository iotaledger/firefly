<script>
    import { onMount } from 'svelte'

    export let progress = 0
    export let classes = null
    let scroller

    onMount(() => {
        if (typeof scroller !== 'undefined') {
            scroller.addEventListener('scroll', update)
            scroller.addEventListener('resize', update)
        }
        update()
        return () => {
            scroller.removeEventListener('scroll', update)
            scroller.removeEventListener('resize', update)
        }
    })
    function update() {
        if (!scroller) return
        progress = (100 * scroller.scrollTop) / (scroller.scrollHeight - scroller.clientHeight)
    }
</script>

<style>
    scroller {
        display: block;
        position: relative;
        max-height: 100%;
        overflow-y: scroll;
    }
</style>

<scroller class={classes} bind:this={scroller}>
    <slot />
</scroller>
