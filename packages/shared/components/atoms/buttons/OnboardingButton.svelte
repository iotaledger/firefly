<script lang="typescript">
    import { appSettings } from '@core/app'
    import { Icon, Spinner, Text } from 'shared/components'
    import { FontWeight, TextType } from 'shared/components/Text.svelte'

    export let primaryText = ''
    export let secondaryText = ''
    export let icon
    export let iconColor = 'blue-500'
    export let iconHeight: string
    export let iconWidth: string
    export let busy = false
    export let disabled = false
    export let hidden = false
    export let classes = ''

    export let onClick: () => unknown

    const secondaryIcon = 'chevron-right'
    const secondaryIconColor = 'gray-500'

    let darkModeEnabled
    $: darkModeEnabled = $appSettings.darkMode
</script>

<button
    type="button"
    {disabled}
    class="rounded-xl px-4 py-3.5 cursor-pointer text-center {classes}"
    on:click|stopPropagation={onClick}
    class:hidden
    class:darkmode={darkModeEnabled}
>
    <div class="grid grid-cols-12 gap-4">
        {#if icon}
            <div class="col-span-1 h-full flex justify-center items-center justify-items-center">
                <Icon height={iconHeight} width={iconWidth} {icon} classes="text-{iconColor}" />
            </div>
        {/if}
        <div
            class="
                h-full flex items-center
                {icon ? 'col-start-2' : 'col-start-1'}
                {secondaryIcon && !disabled ? 'col-end-12' : 'col-end-13'}
            "
        >
            <span class="flex flex-col justify-center">
                <Text
                    type={TextType.p}
                    color="gray-800"
                    darkColor="white"
                    fontSize="14"
                    fontWeight={FontWeight.semibold}
                    lineHeight="5"
                    >{primaryText}
                </Text>
                {#if secondaryText}
                    <Text
                        type={TextType.p}
                        color="gray-600"
                        darkColor="gray-400"
                        fontSize="12"
                        fontWeight={FontWeight.normal}
                        lineHeight="3.5"
                        >{secondaryText}
                    </Text>
                {/if}
            </span>
        </div>
        {#if secondaryIcon && !disabled}
            <div class="col-span-1 col-end-13 h-full flex justify-center items-center justify-items-center">
                {#if busy}
                    <Spinner busy color="gray-600" darkColor="gray-400" />
                {:else}
                    <Icon icon={secondaryIcon} classes="text-{secondaryIconColor}" />
                {/if}
            </div>
        {/if}
    </div>
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
