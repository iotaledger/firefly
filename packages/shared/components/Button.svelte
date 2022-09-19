<script lang="typescript" context="module">
    export enum ButtonSize {
        Large = 'lg',
        Medium = 'md',
        Small = 'sm',
    }

    export enum ButtonVariant {
        Primary = 'primary',
        Caution = 'caution',
        Warning = 'warning',
    }

    export enum HTMLButtonType {
        Button = 'button',
        Submit = 'submit',
        Reset = 'reset',
    }
</script>

<script lang="typescript">
    import { Icon, Spinner } from 'shared/components'
    import { onMount } from 'svelte'
    import { appSettings } from '@core/app'
    import { bindEvents } from '@lib/utils'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'
    import { Event } from '@lib/typings/events'

    export let autofocus: boolean = false
    export let classes: string = ''
    export let disabled: boolean = false
    export let hidden: boolean = false
    export let inlineStyle: string = ''
    export let type: HTMLButtonType = HTMLButtonType.Button

    export let variant: ButtonVariant = ButtonVariant.Primary
    export let size: ButtonSize = ButtonSize.Large
    export let outline: boolean = false

    export let icon: IconEnum = null
    export let iconHeight: number = null
    export let iconWidth: number = null
    export let iconColor: string = null
    export let iconReverse: boolean = false

    export let isBusy: boolean = false
    export let busyMessage: string = ''

    export let form: string = ''
    export let buttonElement: HTMLButtonElement

    export let events: Event<unknown>[] = []

    export let onClick: () => unknown

    export function resetAndFocus(): void {
        if (disabled) {
            setTimeout(resetAndFocus, 100)
        } else {
            buttonElement?.focus()
        }
    }

    const ICON_DEFAULT_SIZE: Readonly<{ [key in ButtonSize]: number }> = {
        [ButtonSize.Large]: 20,
        [ButtonSize.Medium]: 16,
        [ButtonSize.Small]: 12,
    }

    $: dark = $appSettings.darkMode

    onMount(() => {
        if (autofocus) {
            buttonElement?.focus()
        }
    })
</script>

<button
    {disabled}
    {hidden}
    {type}
    {form}
    style={inlineStyle}
    class={`${size} ${variant} ${classes}`}
    class:dark
    class:outline
    use:bindEvents={events}
    on:click|stopPropagation={onClick}
    bind:this={buttonElement}
>
    {#if isBusy}
        <Spinner busy message={busyMessage} classes="items-center justify-center w-full" />
    {:else}
        <div
            class="flex flex-row items-center justify-center w-full"
            class:flex-row-reverse={iconReverse}
        >
            {#if icon}
                <Icon
                    {icon}
                    classes="text-{iconColor}"
                    height={iconHeight ?? ICON_DEFAULT_SIZE[size]}
                    width={iconWidth ?? ICON_DEFAULT_SIZE[size]}
                />
            {/if}
            <slot />
        </div>
    {/if}
</button>

<style type="text/scss">
    button {
        @apply flex;
        @apply flex-row;
        @apply items-center;
        @apply justify-center;
        @apply cursor-pointer;
        @apply box-border;
        @apply text-center;
        @apply font-500;
        @apply text-15;
        @apply leading-4;
        @apply rounded-lg;
    }

    button:disabled {
        @apply pointer-events-none;
        @apply bg-gray-200;
        @apply text-gray-500;

        :global(spinner-container svg) {
            @apply text-gray-500;
        }
    }

    button.dark:disabled {
        @apply bg-gray-700;
        @apply bg-opacity-10;
        @apply text-gray-700;
    }

    .lg {
        @apply py-4;
        @apply px-8;
    }

    .md {
        @apply py-3;
        @apply px-8;
    }

    .sm {
        @apply py-2;
        @apply px-3;
        @apply text-13;
    }

    @mixin button-variant($color) {
        @apply bg-#{$color}-500;
        @apply text-white;

        :global(spinner-container svg) {
            @apply text-white;
        }

        &:hover {
            @apply bg-#{$color}-600;
        }

        &:active,
        &:focus {
            @apply bg-#{$color}-700;
            @apply ring-4;
            @apply ring-#{$color}-400;
            @apply ring-opacity-20;
        }

        &.outline {
            @apply bg-white;
            @apply text-#{$color}-500;
            @apply border;
            @apply border-solid;
            @apply border-gray-300;

            &:hover {
                @apply bg-#{$color}-50;
                @apply border-#{$color}-200;
            }

            &:active,
            &:focus {
                @apply bg-#{$color}-100;
                @apply border-#{$color}-400;
                @apply text-#{$color}-600;
            }

            &:disabled {
                @apply text-gray-500;
                @apply bg-gray-50;
                @apply bg-opacity-50;
                @apply border-opacity-50;
            }

            :global(spinner-container svg) {
                @apply text-gray-500;
            }
        }
    }

    .primary {
        @include button-variant('blue');
    }

    .caution {
        @include button-variant('yellow');
    }

    .warning {
        @include button-variant('red');
    }

    .dark.outline.primary {
        @apply bg-gray-700;
        @apply bg-opacity-10;
        @apply border-gray-600;
        @apply border-opacity-40;
        @apply text-gray-400;

        &:hover {
            @apply bg-opacity-25;
            @apply border-opacity-60;
            @apply text-white;
        }

        &:active,
        &:focus {
            @apply bg-opacity-25;
            @apply border-blue-400;
            @apply border-opacity-100;
            @apply text-white;
        }

        &:disabled {
            @apply bg-transparent;
            @apply border-gray-700;
            @apply border-opacity-50;
            @apply text-gray-500;
            @apply text-opacity-50;
        }
    }
</style>
