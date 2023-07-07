<script lang="ts">
    import { localize } from '@core/i18n'
    import { activeProfile } from '@core/profile'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'
    import { FontWeight, Icon, Text, TextType, Toggle } from '@ui'

    const { isStrongholdLocked } = $activeProfile

    export let disabled: boolean = false
    export let classes: string = ''

    export let onClick: () => unknown
</script>

<button
    type="button"
    {disabled}
    class="w-full rounded-xl p-4 cursor-pointer text-left border border-solid border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-opacity-10 {classes}"
    on:click|stopPropagation={onClick}
>
    <div class="flex flex-row space-x-2 justify-between items-center">
        <div class="flex flex-row space-x-2 items-center">
            <div class="col-span-1 h-full flex justify-center items-center justify-items-center">
                <Icon
                    height={24}
                    width={24}
                    icon={$isStrongholdLocked ? IconEnum.Lock : IconEnum.Unlock}
                    classes="text-blue-500"
                />
            </div>
            <span class="flex flex-col justify-center space-y-0.5">
                <Text
                    type={TextType.p}
                    color="gray-800"
                    darkColor="white"
                    fontSize="14"
                    fontWeight={FontWeight.semibold}
                    lineHeight="5"
                >
                    {localize('views.dashboard.profileModal.stronghold.title')}
                </Text>
                <Text
                    type={TextType.p}
                    color="gray-600"
                    darkColor="gray-400"
                    fontSize="12"
                    fontWeight={FontWeight.normal}
                    lineHeight="3.5"
                >
                    {localize(`views.dashboard.profileModal.stronghold.${$isStrongholdLocked ? 'locked' : 'unlocked'}`)}
                </Text>
            </span>
        </div>
        <div class="col-end-12 h-full flex justify-center items-center justify-items-center">
            <Toggle active={$isStrongholdLocked} />
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
