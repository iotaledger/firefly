<script lang="typescript">
    import { Icon, Text } from 'shared/components'

    export let primary = false
    export let secondary = false
    export let success = false
    export let danger = false
    export let warning = false
    export let info = false
    export let classes: string = ''
    export let icon: 'info' | 'exclamation' | 'none' = 'none'
    export let iconClasses: string = ''
    export let iconSize: string
    export let text: string = ''
    export let textClasses: string = ''
    export let textColor = 'gray-700'
    export let textDarkColor = 'gray-700'

    let _classes
    let _icon
    let _iconClasses

    function setClasses() {
        if (primary) {
            _classes = 'bg-gray-50 dark:bg-gray-800'
        } else if (secondary) {
            _classes = 'bg-gray-50 dark:bg-gray-800'
        } else if (success) {
            _classes = 'bg-green-50 dark:bg-green-50 border-green-500'
            _icon = 'checkmark'
            _iconClasses = 'text-green-500 dark:text-green-500'
        } else if (danger) {
            _classes = 'bg-red-50 dark:bg-red-50 border-red-500'
            _icon = 'success-error'
            _iconClasses = 'text-red-500 dark:text-red-500'
        } else if (warning) {
            _classes = 'bg-yellow-50 dark:bg-yellow-50 border-yellow-500'
            _icon = 'exclamation'
            _iconClasses = 'text-yellow-500 dark:text-yellow-500'
        } else if (info) {
            _classes = 'bg-blue-50 dark:bg-blue-50 border-blue-500'
            _icon = 'info'
            _iconClasses = 'text-blue-500 dark:text-blue-500'
        }
    }

    $: $$props, setClasses()
</script>

{#if text}
    <div class="flex flex-row items-center p-4 rounded-lg border border-solid {_classes} {classes}">
        {#if icon}
            <Icon
                icon={_icon}
                height={iconSize}
                width={iconSize}
                classes="mr-3 fill-current {_iconClasses} {iconClasses}"
            />
        {/if}
        <Text fontSize="14" lineHeight="5" color={textColor} darkColor={textDarkColor} classes={textClasses}>
            {text}
        </Text>
    </div>
{/if}
