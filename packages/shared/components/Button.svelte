<script>
    import { bindEvents } from 'shared/lib/utils'
    import { Icon } from 'shared/components'
    export let events = {}
    export let onClick = () => ''
    export let secondary = false
    export let disabled = false
    export let active = false
    export let icon = undefined
    export let iconReverse = false
    export let xl = false
    export let small = false
    export let classes = ''
</script>

<style type="text/scss">
    button {
        @apply bg-blue-500;
        min-width: 100px;
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
            :global(svg) {
                @apply text-blue-500;
            }
            :global(svg.right) {
                @apply text-gray-500;
            }
            &.active {
                @apply bg-blue-500;
                span,
                :global(svg) {
                    @apply text-white;
                }
            }
            &.disabled {
                :global(svg) {
                    @apply text-gray-500;
                }
            }
        }
        &.small {
            @apply p-2.5;
            @apply rounded-lg;
            min-width: 78px;
            &.with-icon {
                @apply p-2.5;
                @apply text-white;
                span {
                    @apply ml-0;
                    @apply mr-6;
                }
                &.iconReverse {
                    span {
                        @apply ml-6;
                        @apply mr-0;
                    }
                }
                &.secondary {
                    :global(svg) {
                        @apply text-gray-500;
                    }
                }
            }
        }
        &.xl {
            min-width: 100px;
            &,
            &:hover,
            &:active {
                @apply text-gray-800;
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
        class={`xl cursor-pointer text-center rounded-2xl pt-8 pb-4 px-4 flex flex-col items-center ${classes}`}
        use:bindEvents={events}
        on:click={onClick}
        class:disabled
        class:secondary
        class:active
        class:with-icon={icon}>
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
        class:small
        class:disabled
        class:with-icon={icon}
        class:iconReverse
        class:active>
        {#if icon}
            {#if small}
                {#if iconReverse}
                    <div class="relative flex flex-row justify-between">
                        <div class="relative flex items-center flex-1">
                            <div class="absolute left-0 flex items-center">
                                <Icon width={16} height={16} classes="mr-4" {icon} />
                            </div>
                            <span class="font-bold text-12 leading-140"><slot /></span>
                        </div>
                    </div>
                {:else}
                    <div class="relative flex flex-row justify-between">
                        <div class="relative flex items-center flex-1">
                            <span class="font-bold text-12 leading-140"><slot /></span>
                            <div class="absolute right-0 flex items-center">
                                <Icon width={16} height={16} classes="ml-4" {icon} />
                            </div>
                        </div>
                    </div>
                {/if}
            {:else}
                <div class="relative flex flex-row justify-between">
                    <div class="relative flex items-center flex-1">
                        <div class="absolute left-0 flex items-center">
                            <Icon width={16} height={16} classes="mr-4" {icon} />
                        </div>
                        <span class="font-bold text-12 leading-140"><slot /></span>
                    </div>
                    {#if !disabled}
                        <div class="absolute right-0 flex items-center h-full">
                            <Icon icon="arrow-right" classes="right" />
                        </div>
                    {/if}
                </div>
            {/if}
        {:else}
            <span class="font-bold text-12 leading-140"><slot /></span>
        {/if}
    </button>
{/if}
