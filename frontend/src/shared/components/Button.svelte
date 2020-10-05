<script>
    import { bindEvents } from '@shared-lib/utils'
    import { Icon, Box } from '@shared-components'
    export let events = {}

    export let onClick = () => ''
    export let secondary = false
    export let disabled = false
    export let active = false
    export let ghost = false
    export let icon = null
    export let classes = null
</script>

<style type="text/scss">
    button {
        border-radius: 16px;
        padding: 15px 12px;
        cursor: pointer;
        font-style: normal;
        font-weight: 700;
        font-size: 12px;
        line-height: 140%;
        color: var(--button-text-color);
        background-color: var(--button-bg-color);
        min-width: 160px;
        &.ghost {
            border: 1px solid var(--button-border-color);
            background-color: transparent;
            color: var(--button-bg-color);
        }
        &.icon {
            padding: 28px 22px;

            span {
                margin-left: 38px;
                margin-right: 28px;
            }

            :global(svg) {
                position: absolute;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
            }
            :global(svg.right) {
                position: absolute;
                left: inherit;
                right: 0;
                transform: translateY(-50%);
            }
            :global(svg path) {
                fill: var(--button-icon-color);
            }
            :global(svg path.stroke:not(.fixedstroke)) {
                fill: none;
                stroke: var(--button-icon-color);
            }
            &.active {
                :global(svg path) {
                    fill: var(--button-active-icon-color);
                }
                :global(svg path.stroke:not(.fixedstroke)) {
                    fill: none;
                    stroke: var(--button-active-icon-color);
                }
            }
        }
        &.secondary {
            color: var(--button-secondary-text-color);
            background-color: var(--button-secondary-bg-color);
            &.icon {
                padding: 28px 22px;
                :global(svg path) {
                    fill: var(--button-secondary-icon-color);
                }
                :global(svg path.stroke:not(.fixedstroke)) {
                    fill: none;
                    stroke: var(--button-secondary-icon-color);
                }
                &.active {
                    background-color: var(--button-secondary-active-bg-color);
                    color: var(--button-secondary-active-text-color);
                    :global(svg path) {
                        fill: var(--button-secondary-active-icon-color);
                    }
                    :global(svg path.stroke:not(.fixedstroke)) {
                        fill: none;
                        stroke: var(--button-secondary-active-icon-color);
                    }
                }
            }
        }
        &.disabled {
            pointer-events: none !important;
            color: var(--button-disabled-text-color) !important;
            background-color: var(--button-disabled-bg-color) !important;
        }
    }
</style>

<button
    class={classes}
    use:bindEvents={events}
    on:click={onClick}
    class:secondary
    class:disabled
    class:icon
    class:ghost
    class:active>
    {#if icon}
        <Box classes="flex flex-row justify-between">
            <Box classes="flex items-center flex-1">
                <Icon classes="mr-4" {icon} />
                <span><slot /></span>
            </Box>
            <Icon icon="arrow-right" classes="right" />
        </Box>
    {:else}
        <span><slot /></span>
    {/if}
</button>
