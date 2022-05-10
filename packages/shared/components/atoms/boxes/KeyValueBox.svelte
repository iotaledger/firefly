<script lang="typescript">
    import { Text } from 'shared/components'
    import Box from './Box.svelte'

    export let keyText = ''
    export let valueText = ''
    export let textColor = 'gray-600'
    export let darkTextColor = 'gray-500'
    export let backgroundColor = 'gray-50'
    export let darkBackgroundColor = 'gray-850'
    export let classes = ''
</script>

<Box row {backgroundColor} {darkBackgroundColor} classes="justify-between {classes}">
    {#if keyText}
        <Text fontSize="sm" color={textColor} darkColor={darkTextColor}>
            {keyText}
        </Text>
    {:else}
        <slot name="key" />
    {/if}
    {#if valueText}
        <Text fontSize="sm" color={textColor} darkColor={darkTextColor}>
            {valueText}
        </Text>
    {:else}
        <slot name="value" />
    {/if}
</Box>
