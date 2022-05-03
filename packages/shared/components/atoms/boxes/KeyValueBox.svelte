<script lang="typescript">
    import { Text } from 'shared/components'
    import Box from './Box.svelte'

    export let keyText: string = ''
    export let valueText: string = ''
    export let textColor: string = 'gray-600'
    export let darkTextColor: string = 'gray-600'
    export let backgroundColor: string = 'gray-50'
    export let darkBackgrounColor: string = 'gray-50'
    export let classes: string = ''
</script>

<Box {backgroundColor} {darkBackgrounColor} {classes}>
    {#if keyText}
        <Text fontSize="sm" color={textColor} {darkTextColor}>
            {keyText}
        </Text>
    {:else}
        <slot name="key" />
    {/if}
    {#if valueText}
        <Text fontSize="sm" color={textColor} {darkTextColor}>
            {valueText}
        </Text>
    {:else}
        <slot name="value" />
    {/if}
</Box>
