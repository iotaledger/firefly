<script lang="ts">
    import { onMount } from 'svelte'

    export let progress = 0
    export let classes = ''
    export let query = 'section'
    export let index = 0
    export let threshold = 0
    export let y = 0

    let scroller: HTMLElement
    let sections: NodeListOf<Element>

    function update() {
        if (!scroller) {
            return
        }
        progress = (100 * scroller.scrollTop) / (scroller.scrollHeight - scroller.clientHeight)

        for (index = 0; index < sections.length; index += 1) {
            const next = sections[index + 1]
            if (next) {
                const bottom = next.getBoundingClientRect().top
                if (bottom >= threshold) break
            } else {
                break
            }
        }
    }

    onMount(() => {
        if (typeof scroller !== 'undefined') {
            sections = scroller.querySelectorAll(query)
            scroller.addEventListener('scroll', update)
            scroller.addEventListener('resize', update)
        }
        update()
        return () => {
            scroller.removeEventListener('scroll', update)
            scroller.removeEventListener('resize', update)
        }
    })
</script>

<svelte:window bind:scrollY={y} />

<scroller
    bind:this={scroller}
    data-label="scroller"
    id="scroller"
    class="block relative max-h-full overflow-y-auto {classes}"
>
    <slot />
</scroller>
