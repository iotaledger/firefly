<script lang="typescript">
    import { appSettings } from '@core/app'
    import { bindEvents } from 'shared/lib/utils'
    import { Icon, Text } from 'shared/components'
    import { FontWeightText, TextType } from 'shared/components/Text.svelte'

    export let events = []

    export let disabled = false
    export let hidden = false
    export let active = false
    export let icon = undefined
    export let iconColor = ''
    export let classes = ''
    export let iconHeight: string
    export let iconWidth: string
    export let secondaryIcon = 'chevron-right'
    export let secondaryIconColor = 'gray-500'
    export let primaryText = ''
    export let secondaryText = ''

    export let onClick: () => unknown

    export let buttonElement
    let darkModeEnabled

    $: darkModeEnabled = $appSettings.darkMode
</script>

<button
    type="button"
    {disabled}
    class="cursor-pointer text-center rounded-xl px-5 py-3.5 pb-3.5 w-full {classes}"
    use:bindEvents={events}
    on:click|stopPropagation={onClick}
    class:hidden
    class:custom-icon-color={iconColor}
    class:active
    class:darkmode={darkModeEnabled}
    bind:this={buttonElement}
>
    {#if icon}
        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-1 h-full flex justify-center items-center justify-items-center">
                <Icon height={iconHeight} width={iconWidth} {icon} classes="text-{iconColor}" />
            </div>
            <div class="col-span-10 h-full flex items-center">
                <span class="font-bold text-12 leading-140">
                    <Text
                        type={TextType.p}
                        color="gray-800"
                        darkColor="white"
                        fontSize="14"
                        fontWeight={FontWeightText.semibold}
                        lineHeight="5"
                        >{primaryText}
                    </Text>
                    {#if secondaryText}
                        <Text
                            type={TextType.p}
                            color="gray-600"
                            darkColor="gray-400"
                            fontSize="12"
                            fontWeight={FontWeightText.normal}
                            lineHeight="3.5"
                            >{secondaryText}
                        </Text>
                    {/if}
                </span>
            </div>
            {#if secondaryIcon && !disabled}
                <div class="col-span-1 h-full flex justify-center items-center justify-items-center">
                    <Icon icon={secondaryIcon} classes="text-{secondaryIconColor}" />
                </div>
            {/if}
        </div>
    {/if}
</button>

<style type="text/scss">
    button {
        min-width: 200px;
        @apply border;
        @apply border-solid;
        @apply border-gray-300;
        @apply bg-white;
        @apply text-left;

        &:hover {
            @apply bg-blue-50;
            @apply border-gray-500;
        }
        &:active,
        &:focus {
            @apply bg-blue-100;
            @apply border-blue-400;
        }
        &:disabled {
            :global(svg) {
                @apply text-gray-500;
            }
            @apply pointer-events-none;
            @apply bg-gray-50;
        }

        &.darkmode {
            @apply border-gray-700;
            @apply bg-transparent;
            &:hover,
            &:focus,
            &:active {
                @apply bg-gray-700;
                @apply bg-opacity-20;
                @apply border-opacity-50;
            }
            &:disabled {
                @apply bg-gray-700;
                @apply bg-opacity-10;
                @apply border-gray-700;
                @apply border-opacity-10;
            }
        }
    }
</style>
