<script lang="ts">
    import { ButtonSize, ButtonVariant, HTMLButtonType, Icon, Spinner } from 'shared/components'
    import { onMount } from 'svelte'
    import { appSettings } from '@core/app'
    import { debounce } from '@core/utils'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'

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

    export let form: string = null
    export let buttonElement: HTMLButtonElement = undefined

    export let onClick: () => unknown = () => {}

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
    class:outlined={outline}
    class:is-busy={isBusy}
    on:click|stopPropagation={debounce(onClick, 100)}
    bind:this={buttonElement}
>
    {#if isBusy}
        <div class="relative flex justify-center items-center h-4 w-4 shrink-0" class:mr-3={busyMessage}>
            <Spinner busy classes="absolute items-center justify-center" />
        </div>
        {busyMessage}
    {:else}
        <div class="flex flex-row items-center justify-center w-full" class:flex-row-reverse={iconReverse}>
            {#if icon}
                <Icon
                    {icon}
                    classes="text-{iconColor} mx-2"
                    height={iconHeight ?? ICON_DEFAULT_SIZE[size]}
                    width={iconWidth ?? ICON_DEFAULT_SIZE[size]}
                />
            {/if}
            <slot />
        </div>
    {/if}
</button>

<style lang="scss">
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

        &.is-busy {
            @apply text-left;
        }
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
        @apply px-8;
        @apply py-4;

        &.outlined {
            padding-top: calc(1rem - 1px);
            padding-bottom: calc(1rem - 1px);
        }
    }

    .md {
        @apply px-8;
        @apply py-3;

        &.outlined {
            padding-top: calc(0.75rem - 1px);
            padding-bottom: calc(0.75rem - 1px);
        }
    }

    .sm {
        @apply px-3;
        @apply py-2;
        @apply text-13;

        &.outlined {
            padding-top: calc(0.5rem - 1px);
            padding-bottom: calc(0.5rem - 1px);
        }
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

        &.outlined {
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

    .dark.outlined.primary {
        @apply bg-gray-700;
        @apply bg-opacity-20;
        @apply border-gray-600;
        @apply border-opacity-40;
        @apply text-gray-400;

        &:hover {
            @apply bg-opacity-40;
            @apply border-opacity-60;
            @apply text-white;
        }

        &:active,
        &:focus {
            @apply bg-opacity-40;
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
