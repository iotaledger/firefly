<script lang="typescript">
    import { mobile } from '@lib/app'
    import { ButtonMobile, Icon } from 'shared/components'
    import { appSettings } from 'shared/lib/appSettings'
    import { bindEvents } from 'shared/lib/utils'
    import { onMount } from 'svelte'

    export let events = []

    export let secondary = false
    export let disabled = false
    export let caution = false
    export let warning = false
    export let active = false
    export let outline = false
    export let icon = undefined
    export let iconReverse = false
    export let xl = false
    export let medium = false
    export let small = false
    export let xsmall = false
    export let classes = ''
    export let type = 'button'
    export let form = ''
    export let autofocus = false
    export let inlineStyle = ''
    export let showHoverText = undefined
    export let iconOnly = false
    export let iconHeight: string | undefined = undefined
    export let iconWidth: string | undefined = undefined
    export let unstyled = false

    export let onClick = (): void | string => ''

    let buttonElement
    let darkModeEnabled

    $: darkModeEnabled = $appSettings.darkMode

    onMount(() => {
        if (autofocus) {
            buttonElement.focus()
        }
    })
</script>

{#if $mobile}
    <ButtonMobile {...$$props}>
        <slot />
    </ButtonMobile>
{:else if xl}
    <button
        {type}
        {form}
        class="{unstyled
            ? ''
            : 'xl cursor-pointer text-center rounded-xl pt-8 pb-4 px-4 flex flex-col items-center'} {classes}"
        use:bindEvents={events}
        on:click={onClick}
        class:secondary
        class:active
        class:with-icon={icon}
        class:darkmode={darkModeEnabled}
        style={inlineStyle}
        class:unstyled
        {disabled}
        bind:this={buttonElement}
    >
        <Icon classes="mb-1" {icon} height={iconHeight} width={iconWidth} />
        <span class="text-12 leading-140">
            <slot />
        </span>
    </button>
{:else}
    <button
        {type}
        {form}
        class="{unstyled ? '' : 'cursor-pointer text-center rounded-xl px-3 pt-2.5 pb-3.5'} {classes}"
        use:bindEvents={events}
        on:click={onClick}
        class:secondary
        class:caution
        class:warning
        class:medium
        class:small
        class:xsmall
        class:outline
        class:with-icon={icon}
        class:iconReverse
        class:active
        class:darkmode={darkModeEnabled}
        class:showHoverText
        class:unstyled
        style={inlineStyle}
        {disabled}
        bind:this={buttonElement}
    >
        {#if icon}
            {#if small}
                {#if iconReverse}
                    <div class="relative flex flex-row justify-between">
                        <div class="relative flex items-center flex-1">
                            <div class="absolute left-0 flex items-center">
                                <Icon width={iconWidth ?? '16'} height={iconHeight ?? '16'} classes="mr-4" {icon} />
                            </div>
                            <span class="font-bold text-12 leading-140"><slot /></span>
                        </div>
                    </div>
                {:else}
                    <div class="relative flex flex-row justify-between">
                        <div class="relative flex items-center flex-1">
                            <span class="font-bold text-12 leading-140"><slot /></span>
                            <div class="absolute right-0 flex items-center">
                                <Icon
                                    width={showHoverText ? 20 : iconWidth ?? 16}
                                    height={showHoverText ? 20 : iconHeight ?? 16}
                                    classes="ml-4 showHoverText"
                                    {icon}
                                />
                            </div>
                        </div>
                    </div>
                {/if}
            {:else if iconOnly}
                <Icon width={iconWidth ?? 24} height={iconHeight ?? 24} {icon} />
            {:else}
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-1 h-full flex justify-center items-center justify-items-center">
                        <Icon height={iconHeight} width={iconWidth} {icon} />
                    </div>
                    <div class="col-span-10 h-full flex items-center">
                        <span class="font-bold text-12 leading-140"><slot /></span>
                    </div>
                    <div class="col-span-1 h-full flex items-center">
                        {#if !disabled}
                            <Icon icon="chevron-right" classes="right" />
                        {/if}
                    </div>
                </div>
            {/if}
        {:else}
            <span class="text-12 leading-140 w-full"><slot /></span>
        {/if}
    </button>
{/if}

<style type="text/scss">
    button:not(.unstyled) {
        @apply bg-blue-500;
        min-width: 100px;
        span {
            @apply text-white;
        }
        &:not(.secondary) {
            span {
                @apply font-bold;
            }
        }
        &:not(.with-icon) {
            &:hover,
            &:focus {
                @apply bg-blue-600;
            }
            &:active {
                @apply bg-blue-700;
            }
            &.caution {
                @apply bg-yellow-600;
                min-width: 100px;
                span {
                    @apply text-white;
                }
                &:hover {
                    @apply bg-yellow-700;
                }
                &:active,
                &:focus {
                    @apply bg-yellow-800;
                }
                &:disabled {
                    @apply pointer-events-none;
                    @apply bg-gray-200;
                    span {
                        @apply text-gray-500;
                    }
                    &.darkmode {
                        @apply bg-gray-700;
                        @apply bg-opacity-10;
                        span {
                            @apply text-gray-700;
                        }
                    }
                }
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
                    &.darkmode {
                        @apply bg-gray-700;
                        @apply bg-opacity-10;
                        span {
                            @apply text-gray-700;
                        }
                    }
                }
            }
            &.medium {
                @apply pt-1.5;
                @apply pb-2.5;
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
            &.active,
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
            }
        }
        &.outline {
            @apply bg-opacity-0;
            @apply border-2;
            span {
                @apply text-blue-500;
            }
            &.secondary {
                @apply border-white;
                span {
                    @apply text-white;
                }
            }
            &.caution {
                span {
                    @apply text-yellow-600;
                }
            }
            &.warning {
                span {
                    @apply text-red-500;
                }
            }
            &:hover {
                @apply border-opacity-0;
                span {
                    @apply text-gray-900;
                }
            }
        }
        &.with-icon {
            min-width: 200px;
            @apply border;
            @apply border-solid;
            @apply border-gray-300;
            @apply bg-white;
            @apply p-5;
            @apply text-left;
            &.secondary.showHoverText {
                @apply border-transparent;
                @apply bg-transparent;
                min-width: unset;
                span {
                    transform: translateX(5px);
                    transition: all 0.2s;
                    @apply font-500;
                    @apply opacity-0;
                    @apply overflow-hidden;
                    @apply max-w-0;
                    @apply whitespace-nowrap;
                }
                :global(svg.showHoverText) {
                    @apply text-blue-500;
                }
                &:hover {
                    @apply border-gray-300;
                    @apply bg-white;
                    span {
                        transform: translateX(0);
                        @apply max-w-full;
                        @apply opacity-100;
                    }
                    &.darkmode {
                        @apply border-gray-700;
                        @apply bg-transparent;
                    }
                }
                &:disabled {
                    :global(svg.showHoverText) {
                        @apply text-gray-400;
                    }
                    &.darkmode {
                        :global(svg.showHoverText) {
                            @apply text-gray-700;
                        }
                    }
                }
            }
            &.xl {
                @apply pb-6;
                @apply px-5;
            }
            span {
                @apply text-gray-800;
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
                :global(svg),
                :global(svg.right) {
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
        &.xsmall {
            @apply p-1;
            @apply rounded-lg;
            min-width: 64px;
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
            &:not(:disabled),
            &:hover,
            &:active {
                @apply text-gray-800;
            }
            span {
                @apply mx-0;
            }
            &.darkmode {
                @apply bg-gray-700;
                @apply border-gray-700;
                @apply bg-opacity-30;
                @apply border-opacity-30;
                @apply text-white;
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
                    @apply text-gray-700;
                    :global(svg) {
                        @apply text-gray-500;
                    }
                }
                :global(svg) {
                    @apply text-blue-500;
                }
            }
        }

        &:disabled {
            @apply pointer-events-none;
            @apply bg-gray-200;
            span {
                @apply text-gray-500;
            }
            &.darkmode {
                @apply bg-gray-700;
                @apply bg-opacity-10;
                span {
                    @apply text-gray-700;
                }
            }
        }
    }
</style>
