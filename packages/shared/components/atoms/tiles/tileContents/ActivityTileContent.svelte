<script lang="typescript">
    import { Text, Icon, FontWeight } from 'shared/components'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'

    export let title: string
    export let subtitle: string = undefined
    export let icon: IconEnum = undefined
    export let rightText: { text: string; color?: string; classes?: string } = undefined
</script>

{#if icon}
    <div class="relative flex w-8 h-8">
        <div class="rounded-full flex justify-center items-center transition-none p-1 w-8 h-8 bg-gray-500">
            <Icon {icon} width="83.33333%" height="83.33333%" classes="text-white dark:text-gray-800 text-center" />
        </div>
    </div>
{:else}
    <slot name="icon" />
{/if}
<div class="flex flex-col w-full space-y-0.5">
    <div class="flex flex-row justify-between space-x-2 overflow-hidden">
        <Text
            fontWeight={FontWeight.semibold}
            lineHeight="140"
            classes="overflow-hidden overflow-ellipsis multiwrap-line2"
        >
            {title}
        </Text>
        <Text
            fontWeight={FontWeight.semibold}
            lineHeight="140"
            color={rightText?.color}
            classes="text-right {rightText?.classes}"
        >
            {rightText?.text ?? ''}
        </Text>
    </div>
    <div class="flex flex-row w-full justify-between space-x-2 overflow-hidden">
        {#if subtitle}
            <Text fontWeight={FontWeight.medium} lineHeight="140" color="gray-600">
                {subtitle}
            </Text>
        {/if}
    </div>
</div>
