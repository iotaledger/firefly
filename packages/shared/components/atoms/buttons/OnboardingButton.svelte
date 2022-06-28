<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { FontWeightText, TextType } from 'shared/components/Text.svelte'

    export let primaryText = ''
    export let secondaryText = ''
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
    <Text
        type={TextType.p}
        color="gray-800"
        darkColor="white"
        fontSize="14"
        fontWeight={FontWeightText.semibold}
        lineHeight="5">{primaryText}</Text
    >
    {#if secondaryText}
        <Text
            type={TextType.p}
            color="gray-600"
            darkColor="gray-400"
            fontSize="12"
            fontWeight={FontWeightText.normal}
            lineHeight="3.5">{secondaryText}</Text
        >
    {/if}
</Button>
