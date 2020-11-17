<script>
    import { bindEvents } from '@shared-lib/utils'
    import { Icon } from '@shared-components'
    export let events = {}

    export let onClick = () => ''
    export let secondary = false
    export let disabled = false
    export let active = false
    export let ghost = false
    export let icon = undefined
    export let xl = false
    export let classes = ''
</script>

<style type="text/scss">
    // TODO: tailwindify
    button {
        background-color: var(--button-bg-color);
        min-width: 160px;
        span {
            color: var(--button-text-color);
        }
        &.ghost {
            @apply bg-transparent;
            @apply border;
            @apply border-solid;
            border-color: var(--button-border-color);
            span {
                @apply font-medium;
                color: var(--button-bg-color);
            }
        }
        &.with-icon {
            @apply py-6;
            @apply px-5;
            @apply text-left;
            span {
                @apply ml-10;
                @apply mr-6;
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
            background-color: var(--button-secondary-bg-color);
            span {
                color: var(--button-secondary-text-color);
            }
            &.with-icon {
                :global(svg path) {
                    fill: var(--button-secondary-icon-color);
                }
                :global(svg path.stroke:not(.fixedstroke)) {
                    fill: none;
                    stroke: var(--button-secondary-icon-color);
                }
                &.active {
                    background-color: var(--button-secondary-active-bg-color);
                    span {
                        color: var(--button-secondary-active-text-color);
                    }
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
        &.xl {
            @apply bg-transparent;
            @apply border;
            @apply border-solid;
            @apply border-gray-300;
            @apply min-w-0;
            span {
                @apply font-medium;
                color: var(--button-bg-color);
            }
        }
        &.disabled {
            @apply pointer-events-none;
            background-color: var(--button-disabled-bg-color) !important;
            span {
                color: var(--button-disabled-text-color) !important;
            }
        }
    }
</style>

{#if xl}
    <button
        class={`xl cursor-pointer  text-center rounded-2xl px-6 py-4 flex flex-col items-center ${classes}`}
        use:bindEvents={events}
        on:click={onClick}
        class:disabled>
        <Icon classes="mb-1" {icon} />
        <div class="text-12 leading-140">
            <slot />
        </div>
    </button>
{:else}
    <button
        class={`cursor-pointer text-center rounded-2xl px-3 py-4 ${classes}`}
        use:bindEvents={events}
        on:click={onClick}
        class:secondary
        class:disabled
        class:with-icon={icon}
        class:ghost
        class:active>
        {#if icon}
            <div class="relative flex flex-row justify-between">
                <div class="relative flex items-center flex-1">
                    <div class="absolute left-0 flex items-center">
                        <Icon classes="mr-4" {icon} />
                    </div>
                    <span class="font-bold text-12 leading-140"><slot /></span>
                </div>
                <div class="absolute right-0 flex items-center h-full">
                    <Icon icon="arrow-right" classes="right" />
                </div>
            </div>
        {:else}
            <span class="font-bold text-12 leading-140"><slot /></span>
        {/if}
    </button>
{/if}
