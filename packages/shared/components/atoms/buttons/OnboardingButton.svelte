<script lang="typescript">
    import { Button } from 'shared/components'

    export let icon = undefined
    export let iconColor = 'blue-500'
    export let iconHeight: '16'
    export let iconWidth: '16'
    export let hidden = false
    export let disabled = false
    export let classes = ''

    const secondaryIcon = 'chevron-right'
    const secondaryIconColor = 'gray-500'

    export let onClick: () => unknown
</script>

<Button
    secondary
    {icon}
    {iconColor}
    {iconHeight}
    {iconWidth}
    {secondaryIcon}
    {secondaryIconColor}
    {hidden}
    {disabled}
    classes="w-full {classes}"
    {onClick}
>
    <slot />
</Button>
