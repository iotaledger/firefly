<script lang="typescript">
    import { appSettings } from '@core/app'
    import { Icon, Text } from 'shared/components'
    import { FontWeightText, TextType } from 'shared/components/Text.svelte'

    export let disabled = false
    export let hidden = false
    export let icon = undefined
    export let iconColor = 'blue-500'
    export let classes = ''
    export let iconHeight: string
    export let iconWidth: string
    export let secondaryIcon = 'chevron-right'
    export let secondaryIconColor = 'gray-500'
    export let primaryText = ''
    export let secondaryText = ''

    export let onClick: () => unknown

    let darkModeEnabled

    $: darkModeEnabled = $appSettings.darkMode
</script>

<button
    type="button"
    {disabled}
    class="rounded-xl max-w-full w-98 px-5 py-3.5 cursor-pointer text-center {classes}"
    on:click|stopPropagation={onClick}
    class:hidden
    class:darkmode={darkModeEnabled}
>
    {#if icon}
        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-1 h-full flex justify-center items-center justify-items-center">
                <Icon height={iconHeight} width={iconWidth} {icon} classes="text-{iconColor}" />
            </div>
            <div class="col-span-10 h-full flex items-center">
                <span class="flex flex-col justify-center">
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
        span {
            min-height: 36px;
        }

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
