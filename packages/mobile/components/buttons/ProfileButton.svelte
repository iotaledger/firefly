<script lang="typescript">
    import { appSettings } from '@core/app'
    import { Icon, NetworkIcon, Text, FontWeight, TextType } from 'shared/components'
    import { getInitials as _getInitials } from 'shared/lib/helpers'
    import { NetworkProtocol, NetworkType } from '@core/network'

    export let name = ''
    export let id = ''
    export let networkType: NetworkType
    export let networkProtocol: NetworkProtocol
    export let disabled = false

    export let onClick: undefined | ((id: string) => void) = undefined

    function handleOnClick(): void {
        onClick && onClick(id)
    }

    $: darkModeEnabled = $appSettings.darkMode

    // @TODO: move to shared lib
    function getInitials() {
        const initials = _getInitials(name, 1)
        if (initials.length === 1) {
            return initials
        } else {
            const letters = initials.split('')
            return letters[0] + letters[letters.length - 1]
        }
    }
</script>

<button
    type="button"
    {disabled}
    class="rounded-xl px-4 py-3 w-full"
    on:click={handleOnClick}
    class:darkmode={darkModeEnabled}
>
    <div class="flex flex-row">
        <div class="relative">
            <div class="h-14 w-14 rounded-full bg-blue-500 flex items-center justify-center">
                <Text type={TextType.h5} classes="text-white">{getInitials()}</Text>
            </div>
            <div class="absolute right-0 bottom-0">
                <NetworkIcon {networkType} {networkProtocol} height={14} width={14} />
            </div>
        </div>
        <Text
            type={TextType.p}
            color="gray-800"
            darkColor="white"
            fontSize="14"
            fontWeight={FontWeight.semibold}
            lineHeight="5"
            classes="px-4 my-auto flex-grow text-left truncate"
            >{name}
        </Text>
        <div class="w-4 items-center my-auto">
            <Icon icon="chevron-right" classes="text-gray-500 dark:text-white" />
        </div>
    </div>
</button>

<style type="text/scss">
    button {
        @apply border;
        @apply border-solid;
        @apply border-gray-300;
        @apply bg-transparent;

        &:disabled {
            :global(svg) {
                @apply text-gray-500;
            }
            @apply pointer-events-none;
            @apply bg-gray-50;
        }

        &.darkmode {
            @apply border-gray-700;
            &:disabled {
                @apply bg-gray-700;
                @apply bg-opacity-10;
                @apply border-gray-700;
                @apply border-opacity-10;
            }
        }
    }
</style>
