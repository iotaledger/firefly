<script lang="ts">
    import { Icon, Text } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let primary = false
    export let secondary = false
    export let success = false
    export let danger = false
    export let warning = false
    export let info = false
    export let classes: string = ''
    export let icon: IconEnum.Info | IconEnum.Exclamation | undefined = undefined
    export let iconClasses: string = ''
    export let iconSize: string = ''
    export let text: string = ''
    export let textClasses: string = ''
    export let textColor = 'gray-700'
    export let textDarkColor = 'gray-400'

    let _classes: string
    let _icon: IconEnum
    let _iconClasses: string

    function setClasses(): void {
        if (primary) {
            _classes = 'bg-gray-50 dark:bg-gray-800'
        } else if (secondary) {
            _classes = 'bg-gray-50 dark:bg-gray-800'
        } else if (success) {
            _classes = 'bg-green-50 dark:bg-green-500'
            _icon = IconEnum.CheckmarkFilled
            _iconClasses = 'text-green-700 dark:text-green-700'
        } else if (danger) {
            _classes = 'bg-red-50 dark:bg-red-500'
            _icon = IconEnum.ErrorFilled
            _iconClasses = 'text-red-500 dark:text-red-500'
        } else if (warning) {
            _classes = 'bg-yellow-50 dark:bg-yellow-500'
            _icon = IconEnum.ExclamationFilled
            _iconClasses = 'text-yellow-700 dark:text-yellow-700'
        } else if (info) {
            _classes = 'bg-blue-50 dark:bg-blue-500'
            _icon = IconEnum.InfoFilled
            _iconClasses = 'text-blue-600 dark:text-blue-600'
        }
    }

    $: $$props, setClasses()
</script>

{#if text}
    <div class="flex flex-row items-center p-4 rounded-lg dark:bg-opacity-10 {_classes} {classes}">
        <Icon
            icon={icon ?? _icon}
            height={iconSize}
            width={iconSize}
            primaryColor="white"
            classes="mr-3 fill-current {_iconClasses} {iconClasses}"
        />
        <Text fontSize="14" lineHeight="5" color={textColor} darkColor={textDarkColor} classes={textClasses}>
            {text}
        </Text>
    </div>
{/if}
