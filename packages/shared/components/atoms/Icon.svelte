<script lang="ts">
    import { ICON_SVG_MAP, Icon } from '@lib/auxiliary/icon'

    export let icon: Icon = undefined
    export let width: number | string = undefined
    export let height: number | string = undefined
    export let classes = ''
    export let boxed = false
    export let boxClasses = 'undefined'
    export let boxStyles = ''
    export let primaryColor: string = undefined
    export let secondaryColor: string = undefined
    export let removeWhitespace = false

    let svg: SVGSVGElement
    let viewBox = { x: 0, y: 0, width: 0, height: 0 }

    function setViewBox(): void {
        if (removeWhitespace) {
            const { x, y, width, height } = svg.getBBox()
            viewBox = { x, y, width, height }
        } else {
            viewBox = { x: 0, y: 0, width: selected.width, height: selected.height }
        }
    }

    $: selected = ICON_SVG_MAP[icon]
    $: selected, svg && setViewBox()
</script>

{#if selected}
    {#if boxed}
        <div class="boxed w-8 h-8 flex justify-center items-center {boxClasses}" style={boxStyles}>
            <svg
                bind:this={svg}
                data-label="icon"
                class="shrink-0 {classes}"
                width={width || selected.width || '100%'}
                height={height || selected.height || '100%'}
                viewBox="{viewBox.x} {viewBox.y} {viewBox.width} {viewBox.height}"
                xmlns="http://www.w3.org/2000/svg"
            >
                {#each selected.path as path}
                    <path
                        class:stroke={path?.strokeWidth}
                        class:fixedstrokeColor={path?.strokeColor}
                        class:fill-current={!path?.strokeWidth && !path?.strokeColor}
                        class:stroke-current={path?.strokeWidth && !path?.strokeColor}
                        d={path?.d}
                        fill-rule={path?.fillRule}
                        clip-rule={path?.clipRule || ''}
                        stroke-width={path?.strokeWidth || ''}
                        stroke-linecap={path?.strokeLinecap}
                        stroke={path?.strokeColor || 'white-100'}
                        opacity={path?.opacity || 1}
                        fill={path?.fillPriority === 'primary'
                            ? primaryColor ?? path.fill ?? ''
                            : path?.fillPriority === 'secondary'
                            ? secondaryColor ?? path.fill ?? ''
                            : path.fill ?? ''}
                    />
                {/each}
                {#if selected.circles}
                    {#each selected.circles as circle}
                        <circle
                            cx={circle.cx}
                            cy={circle.cy}
                            r={circle.r}
                            fill={circle.fill}
                            stroke-width={circle.strokeWidth || ''}
                            stroke={circle.strokeColor || ''}
                        />
                    {/each}
                {/if}
            </svg>
        </div>
    {:else}
        <svg
            bind:this={svg}
            data-label="icon"
            class="shrink-0 {classes}"
            width={width || selected.width || '100%'}
            height={height || selected.height || '100%'}
            viewBox="{viewBox.x} {viewBox.y} {viewBox.width} {viewBox.height}"
            xmlns="http://www.w3.org/2000/svg"
        >
            {#each selected.path as path}
                <path
                    class:stroke={path?.strokeWidth}
                    class:fixedstrokeColor={path?.strokeColor}
                    class:fill-current={!(
                        (path?.fillPriority === 'primary' && primaryColor) ||
                        (path?.fillPriority === 'secondary' && secondaryColor)
                    ) &&
                        !path?.strokeWidth &&
                        !path?.strokeColor}
                    class:stroke-current={path?.strokeWidth && !path?.strokeColor}
                    d={path?.d}
                    fill-rule={path?.fillRule}
                    clip-rule={path?.clipRule || ''}
                    stroke-width={path?.strokeWidth || ''}
                    stroke-linecap={path?.strokeLinecap}
                    stroke={path?.strokeColor || ''}
                    opacity={path?.opacity || 1}
                    fill={path?.fillPriority === 'primary'
                        ? primaryColor ?? path.fill ?? ''
                        : path?.fillPriority === 'secondary'
                        ? secondaryColor ?? path.fill ?? ''
                        : path.fill ?? ''}
                />
            {/each}
            {#if selected.circles}
                {#each selected.circles as circle}
                    <circle
                        cx={circle.cx}
                        cy={circle.cy}
                        r={circle.r}
                        fill={circle.fill}
                        stroke-width={circle.strokeWidth || ''}
                        stroke={circle.strokeColor || ''}
                    />
                {/each}
            {/if}
        </svg>
    {/if}
{/if}

<style type="text/scss">
    .boxed {
        border-radius: 0.625rem; // TODO: add to tailwind
    }
    /* Hotfix to avoid the SVG slow transition */
    svg,
    svg path {
        transition: background 0.05s, color 0.05s, border-color 0.05s, opacity 0.05s;
    }
</style>
