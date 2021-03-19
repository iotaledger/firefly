<script lang="typescript">
    export let classes = ''
    export let topOffset
    export let leftOffset
    export let elementWidth //width of hovered element
    
    let tooltip
    $: if (tooltip) {
        tooltip.style.top = topOffset - tooltip.offsetHeight - 15 + 'px'
        tooltip.style.left = leftOffset - tooltip.offsetWidth/2 + elementWidth + 'px'
    }
</script>

<style type="text/scss">
    tooltip {
        max-width: 15rem;
    }
    tooltip:after, triangle{
        height: 0;
        left: 50%;
        margin-left: -10px;
        position: absolute;
        width: 0;
    }
    tooltip:after {
        border-left: solid transparent 10px;
        border-right: solid transparent 10px;
        border-top: solid white 10px;
        bottom: -10px;
        content: " ";
    }
    triangle{
        border-left: solid transparent 11px;
        border-right: solid transparent 11px;
        border-top: solid rgba(0,0,0,0.03) 11px;
        bottom: -13px;
    }
</style>

<tooltip class="fixed py-4 px-6 w-max shadow-lg rounded-xl bg-white cursor-pointer text-center z-10 {classes}" bind:this={tooltip}>
    <slot />
    <triangle/>
</tooltip>
