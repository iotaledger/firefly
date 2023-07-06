<script lang="ts">
    import { appSettings } from '@core/app'
    import { Icon, Spinner, Text, FontWeight, TextType } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let primaryText: string = ''
    export let secondaryText: string = ''
    export let icon: IconEnum | undefined = undefined
    export let iconColor: string = 'blue-500'
    export let iconHeight: string = undefined
    export let iconWidth: string = undefined
    export let busy: boolean = false
    export let disabled: boolean = false
    export let hidden: boolean = false
    export let classes: string = ''

    export let onClick: () => unknown

    const secondaryIcon = 'chevron-right'
    const secondaryIconColor = 'gray-500'

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
                    <Spinner busy width="20" height="20" color="gray-500" darkColor="gray-500" />
                {:else}
                    <Icon icon={IconEnum.ChevronRight} classes="text-{secondaryIconColor}" />
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
