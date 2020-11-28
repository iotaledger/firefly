<script>
    import { bindEvents } from 'shared/lib/utils'
    import { Icon } from 'shared/components'
    export let events = {}

    export let onClick = () => ''
    export let secondary = false
    export let disabled = false
    export let active = false
    export let icon = undefined
    export let xl = false
    export let classes = ''
</script>

<style type="text/scss">
    button {
        @apply bg-blue-500;
        min-width: 160px;
        span {
            @apply text-white;
        }
        &:not(.with-icon):hover {
            @apply bg-blue-600;
        }
        &:not(.with-icon):active {
            @apply bg-blue-700;
        }
        &.disabled {
            @apply pointer-events-none;
            @apply bg-gray-200;
            span {
                @apply text-gray-500;
            }
        }
        &.secondary {
            @apply border;
            @apply border-solid;
            @apply border-gray-300;
            @apply bg-white;
            span {
                @apply text-blue-500;
            }
            &:hover {
                @apply bg-blue-50;
                @apply border-blue-200;
            }
            &:active {
                @apply bg-blue-100;
                @apply border-blue-400;
                @apply text-blue-600;
            }
            &.disabled {
                @apply pointer-events-none;
                @apply bg-gray-50;
                span {
                    @apply text-gray-500;
                }
            }
        }
        &.with-icon {
            @apply border;
            @apply border-solid;
            @apply border-gray-300;
            @apply bg-white;
            @apply py-6;
            @apply px-5;
            @apply text-left;
            span {
                @apply text-gray-800;
                @apply ml-10;
                @apply mr-6;
            }
            :global(svg path) {
                @apply text-blue-500;
                @apply fill-current;
            }
            :global(svg.right path) {
                @apply text-gray-500;
                @apply fill-current;
            }
            :global(svg path.stroke:not(.fixedstroke)) {
                fill: none;
                @apply text-blue-500;
                @apply stroke-current;
            }
            &.active {
                @apply bg-blue-500;
                span {
                    @apply text-white;
                }
                :global(svg path) {
                    @apply text-white;
                    @apply fill-current;
                }
                :global(svg path.stroke:not(.fixedstroke)) {
                    fill: none;
                    @apply text-white;
                    @apply stroke-current;
                }
            }
            &.disabled {
                :global(svg path) {
                    @apply text-gray-500;
                    @apply fill-current;
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
                @apply text-blue-500;
            }
        }
        &.disabled {
            @apply pointer-events-none;
            @apply bg-gray-200;
            span {
                @apply text-gray-500;
            }
        }
    }
</style>

{#if xl}
    <button
        class={`xl cursor-pointer text-center rounded-2xl px-6 py-4 flex flex-col items-center ${classes}`}
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
        class:active>
        {#if icon}
            <div class="relative flex flex-row justify-between">
                <div class="relative flex items-center flex-1">
                    <div class="absolute left-0 flex items-center">
                        <Icon classes="mr-4" {icon} />
                    </div>
                    <span class="font-bold text-12 leading-140"><slot /></span>
                </div>
                {#if !disabled}
                    <div class="absolute right-0 flex items-center h-full">
                        <Icon icon="arrow-right" classes="right" />
                    </div>
                {/if}
            </div>
        {:else}
            <span class="font-bold text-12 leading-140"><slot /></span>
        {/if}
    </button>
{/if}
