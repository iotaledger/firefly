<script lang="typescript">
    import { Text } from 'shared/components'
    import Box from './Box.svelte'

    export let keyText = ''
    export let valueText = ''
    export let textColor = 'gray-600'
    export let darkTextColor = 'gray-500'
    export let backgroundColor = 'gray-50'
    export let darkBackgroundColor = 'gray-850'
    export let padding = 'px-4 py-3.5'
    export let classes = ''
</script>

<Box row clearPadding {backgroundColor} {darkBackgroundColor} classes="justify-between {padding} {classes}">
    {#if keyText}
        <Text fontSize="14" lineHeight="5" color={textColor} darkColor={darkTextColor} classes="mr-4">
            {keyText}
        </Text>
    {:else}
        <slot name="key" />
    {/if}
    {#if valueText}
        <Text fontSize="14" lineHeight="5" color={textColor} darkColor={darkTextColor} classes="truncate">
            {valueText}
        </Text>
    {:else}
        <slot name="value" />
    {/if}
</Box>
