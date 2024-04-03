<script lang="ts">
    import { Icon, Text, TextHintVariant, TextType } from '@ui'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'

    export let variant: TextHintVariant
    export let icon: IconEnum | undefined = undefined
    export let text: string = ''
    export let valuePre: string = ''

    $: iconClasses = DEFAULT_VALUES[variant].iconClasses
    $: icon ||= DEFAULT_VALUES[variant].icon

    const DEFAULT_VALUES: {
        [Variant in TextHintVariant]: {
            icon: IconEnum | undefined
            iconClasses: string | undefined
        }
    } = {
        [TextHintVariant.Primary]: {
            icon: undefined,
            iconClasses: undefined,
        },
        [TextHintVariant.Secondary]: {
            icon: undefined,
            iconClasses: undefined,
        },
        [TextHintVariant.Success]: {
            icon: IconEnum.CheckmarkFilled,
            iconClasses: 'text-green-700 dark:text-green-700',
        },
        [TextHintVariant.Danger]: {
            icon: IconEnum.ErrorFilled,
            iconClasses: 'text-red-500 dark:text-red-500',
        },
        [TextHintVariant.Warning]: {
            icon: IconEnum.ExclamationFilled,
            iconClasses: 'text-yellow-700 dark:text-yellow-700',
        },
        [TextHintVariant.Info]: {
            icon: IconEnum.InfoFilled,
            iconClasses: 'text-blue-600 dark:text-blue-600',
        },
    }
</script>

{#if text}
    <text-hint class="{variant} dark-bg-opacity">
        {#if icon}
            <Icon {icon} primaryColor="white" classes="mr-3 fill-current {iconClasses}" />
        {/if}
        <div class="flex flex-col space-y-1 text-left">
            <Text fontSize="14" lineHeight="5">
                {text}
            </Text>
            {#if valuePre}
                <Text type={TextType.pre}>
                    {valuePre}
                </Text>
            {/if}
        </div>
    </text-hint>
{/if}

<style lang="scss">
    text-hint {
        @apply flex flex-row;
        @apply items-center;
        @apply p-4;
        @apply rounded-lg;
        &.primary {
            @apply bg-gray-50 dark:bg-gray-800;
        }
        &.secondary {
            @apply bg-gray-50 dark:bg-gray-800;
        }
        &.success {
            @apply bg-green-50 dark:bg-green-500;
        }
        &.danger {
            @apply bg-red-50 dark:bg-red-500;
        }
        &.warning {
            @apply bg-yellow-50 dark:bg-yellow-500;
        }
        &.info {
            @apply bg-blue-50 dark:bg-blue-500;
        }
        &.dark-bg-opacity {
            @apply dark:bg-opacity-10;
        }
    }
</style>
