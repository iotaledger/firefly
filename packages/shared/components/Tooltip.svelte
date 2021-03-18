<script lang="typescript">
    import { Icon } from 'shared/components'
    export let classes = ''
    export let top 
    export let left
    export let elementWidth
    let el
    let tooltipWidth, 
        tooltipHeight = 0
    
    $: if (el) {
        tooltipWidth = el.offsetWidth
        tooltipHeight = el.offsetHeight
        el.style.top = top - tooltipHeight - 8 + 'px'
        el.style.left = left - tooltipWidth/2 + elementWidth + 'px'
    }
</script>

<style type="text/scss">
    tooltip {
        max-width: 15rem;
    }
</style>

<tooltip class="fixed py-4 px-6 w-max shadow-lg rounded-xl bg-white cursor-pointer text-center z-10 {classes}" bind:this={el}>
    <slot />
</tooltip>
