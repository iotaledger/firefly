<script lang="ts">
    import { Icon as IconEnum } from '@lib/auxiliary/icon'
    import { FontWeight, Icon, Text, TextType } from '@ui'

    export let primaryText: string = ''
    export let secondaryText: string = ''
    export let icon: IconEnum = undefined
    export let iconColor: string = 'blue-500'
    export let disabled: boolean = false
    export let classes: string = ''
    export let color: string = 'transparent'

    export let onClick: () => unknown

    const secondaryIcon = IconEnum.ChevronRight
    const secondaryIconColor = 'gray-500'
</script>

<button
    type="button"
    {disabled}
    class="w-full rounded-xl p-4 cursor-pointer text-left border border-solid border-{color === 'transparent'
        ? 'gray-200'
        : color} dark:border-{color === 'transparent' ? 'gray-600' : color} bg-{color} bg-opacity-30 {classes}"
    on:click|stopPropagation={onClick}
>
    <div class="grid grid-cols-12 gap-4">
        {#if icon}
            <div class="col-span-1 h-full flex justify-center items-center justify-items-center">
                <Icon height={24} width={24} {icon} classes="text-{iconColor}" />
            </div>
        {/if}
        <div
            class="
                h-full flex items-center
                {icon ? 'col-start-2' : 'col-start-1'}
                {!disabled ? 'col-end-12' : 'col-end-13'}
            "
        >
            <span class="flex flex-col justify-center space-y-0.5">
                <Text
                    type={TextType.p}
                    color="gray-800"
                    darkColor="white"
                    fontSize="14"
                    fontWeight={FontWeight.semibold}
                    lineHeight="5"
                >
                    {primaryText}
                </Text>
                {#if secondaryText}
                    <Text
                        type={TextType.p}
                        color="gray-600"
                        darkColor="gray-400"
                        fontSize="12"
                        fontWeight={FontWeight.normal}
                        lineHeight="3.5"
                    >
                        {secondaryText}
                    </Text>
                {/if}
            </span>
        </div>
        <div class="col-span-1 col-end-13 h-full flex justify-center items-center justify-items-center">
            <Icon icon={secondaryIcon} classes="text-{secondaryIconColor}" />
        </div>
    </div>
</button>

<style lang="scss">
    button {
        &:disabled {
            @apply pointer-events-none;
            @apply opacity-50;
            :global(svg) {
                @apply text-gray-500;
            }
        }
    }
</style>
