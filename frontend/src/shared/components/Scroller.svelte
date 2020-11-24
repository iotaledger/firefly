<script>
    import { onMount } from 'svelte'

    export let progress = 0
    export let classes = ''

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

<div data-label="scroller" class={`block relative max-h-full overflow-y-scroll ${classes}`} bind:this={scroller}>
    <slot />
</div>
