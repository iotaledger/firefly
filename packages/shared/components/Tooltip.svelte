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
    tooltip:after, triangle, triangleDark{
        height: 0;
        left: 50%;
        margin-left: -10px;
        position: absolute;
        width: 0;
    }
/*     tooltip:after {
        border-left: solid transparent 11px;
        border-right: solid transparent 11px;
        border-top: solid rgba(0,0,0,0.03) 11px;
        bottom: -13px;
    } */
    triangle{
        border-left: solid transparent 10px;
        border-right: solid transparent 10px;
        border-top: solid white 10px;
        bottom: -10px;
        content: " ";
        z-index: 2;
    }
    triangleDark{
        border-left: solid transparent 11px;
        border-right: solid transparent 11px;
        border-top: solid white 11px;
        bottom: -11px;
        content: " ";
        z-index: 1;
    }
</style>

<tooltip class="fixed py-4 px-6 w-max shadow-lg border-white rounded-xl border border-solid bg-white cursor-pointer text-center z-10 dark:bg-gray-900 dark:border-gray-700 {classes}" bind:this={tooltip}>
    <slot />
    <triangle class="dark:border-gray-900" style="border-left-color: transparent; border-right-color: transparent;"/>
    <triangleDark class="dark:border-gray-700 dark:block" style="border-left-color: transparent; border-right-color: transparent;"/>
</tooltip>
