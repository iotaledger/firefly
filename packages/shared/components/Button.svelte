<script lang="typescript">
    import { Icon } from 'shared/components'
    import { bindEvents } from 'shared/lib/utils'
    import { onMount } from 'svelte'
    import { darkMode } from 'shared/lib/app'
    export let events = {}
    export let onClick = () => ''
    export let secondary = false
    export let disabled = false
    export let warning = false
    export let active = false
    export let icon = undefined
    export let iconReverse = false
    export let xl = false
    export let small = false
    export let classes = ''
    export let type = 'button'
    export let form = ''
    export let autofocus = false

    let buttonElement

    onMount(() => {
        if (autofocus) {
            buttonElement.focus()
        }
    })
</script>

<style type="text/scss">
    button {
        @apply bg-blue-500;
        min-width: 100px;
        span {
            @apply text-white;
        }
        &:not(.with-icon) {
            &:hover,
            &:focus {
                @apply bg-blue-600;
            }
            &:active {
                @apply bg-blue-700;
            }
            &.warning {
                @apply bg-red-500;
                min-width: 100px;
                span {
                    @apply text-white;
                }
                &:hover {
                    @apply bg-red-600;
                }
                &:active,
                &:focus {
                    @apply bg-red-700;
                }
                &:disabled {
                    @apply pointer-events-none;
                    @apply bg-gray-200;
                    span {
                        @apply text-gray-500;
                    }
                }
            }
            &.darkmode {
                @apply bg-gray-700;
                @apply border-gray-700;
                @apply bg-opacity-30;
                @apply border-opacity-30;
                span {
                    @apply text-white;
                }
                &:hover {
                    @apply bg-opacity-50;
                    @apply border-opacity-50;
                }
                &:focus,
                &:active {
                    @apply bg-opacity-80;
                    @apply border-opacity-50;
                }
                &:disabled {
                    @apply bg-gray-700;
                    @apply border-gray-700;
                    @apply bg-opacity-10;
                    @apply border-opacity-10;
                    span {
                        @apply text-gray-700;
                    }
                }
                &.warning {
                    @apply bg-red-500;
                    @apply border-red-500;
                    min-width: 100px;
                    span {
                        @apply text-white;
                    }
                    &:hover {
                        @apply bg-red-600;
                        @apply border-red-600;
                    }
                    &:active,
                    &:focus {
                        @apply bg-red-700;
                        @apply border-red-700;
                    }
                    &:disabled {
                        @apply pointer-events-none;
                        @apply bg-gray-200;
                        @apply border-gray-200;
                        span {
                            @apply text-gray-500;
                        }
                    }
                }
            }
        }
        &:disabled {
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
            &:active,
            &:focus {
                @apply bg-blue-100;
                @apply border-blue-400;
                @apply text-blue-600;
            }

            &:disabled {
                @apply pointer-events-none;
                @apply bg-gray-50;
                span {
                    @apply text-gray-500;
                }
            }
            &.darkmode {
                @apply bg-transparent;
                @apply border-gray-700;
                span {
                    @apply text-white;
                }
                &:hover {
                    @apply bg-gray-700;
                    @apply bg-opacity-20;
                }
                &:active,
                &:focus {
                    @apply bg-gray-900;
                    @apply border-gray-700;
                }
                &:disabled {
                    @apply text-gray-700;
                    span {
                        @apply text-gray-700;
                    }
                }
            }
        }
        &.with-icon {
            min-width: 200px;
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
            &:hover,
            &:focus {
                @apply border-gray-500;
            }
            &:disabled {
                :global(svg) {
                    @apply text-gray-500;
                }
            }
            &.active {
                @apply bg-blue-500;
                span,
                :global(svg) {
                    @apply text-white;
                }
            }
            &.darkmode {
                @apply border-gray-700;
                @apply bg-transparent;
                span {
                    @apply text-white;
                }
                :global(svg, svg.right) {
                    @apply text-gray-500;
                }
                &:hover,
                &:focus {
                    @apply bg-gray-700;
                    @apply bg-opacity-20;
                }
                &:disabled {
                    :global(svg) {
                        @apply text-gray-500;
                    }
                }
                &.active {
                    @apply bg-gray-700;
                    @apply border-gray-700;
                    span,
                    :global(svg) {
                        @apply text-white;
                    }
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

        &:disabled {
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
        {type}
        {form}
        class={`xl cursor-pointer text-center rounded-2xl pt-8 pb-4 px-4 flex flex-col items-center ${classes}`}
        use:bindEvents={events}
        on:click={onClick}
        class:secondary
        class:active
        class:with-icon={icon}
        class:darkmode={$darkMode}
        {disabled}
        bind:this={buttonElement}>
        <Icon classes="mb-1" {icon} />
        <div class="text-12 leading-140">
            <slot />
        </div>
    </button>
{:else}
    <button
        {type}
        {form}
        class={`cursor-pointer text-center rounded-2xl px-3 py-4 ${classes}`}
        use:bindEvents={events}
        on:click={onClick}
        class:secondary
        class:warning
        class:small
        class:with-icon={icon}
        class:iconReverse
        class:active
        class:darkmode={$darkMode}
        {disabled}
        bind:this={buttonElement}>
        {#if icon}
            {#if small}
                {#if iconReverse}
                    <div class="relative flex flex-row justify-between">
                        <div class="relative flex items-center flex-1">
                            <div class="absolute left-0 flex items-center">
                                <Icon classes="mr-4" {icon} />
                            </div>
                            <span class="font-bold text-12 leading-140"><slot /></span>
                        </div>
                    </div>
                {:else}
                    <div class="relative flex flex-row justify-between">
                        <div class="relative flex items-center flex-1">
                            <span class="font-bold text-12 leading-140"><slot /></span>
                            <div class="absolute right-0 flex items-center">
                                <Icon classes="ml-4" {icon} />
                            </div>
                        </div>
                    </div>
                {/if}
            {:else}
                <div class="relative flex flex-row justify-between">
                    <div class="relative flex items-center flex-1">
                        <div class="absolute left-0 flex items-center">
                            <Icon classes="mr-4" {icon} />
                        </div>
                        <span class="font-bold text-12 leading-140"><slot /></span>
                    </div>
                    {#if !disabled}
                        <div class="absolute right-0 flex items-center h-full">
                            <Icon icon="chevron-right" classes="right" />
                        </div>
                    {/if}
                </div>
            {/if}
        {:else}
            <span class="font-bold text-12 leading-140"><slot /></span>
        {/if}
    </button>
{/if}
