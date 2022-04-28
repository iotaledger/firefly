<script lang="typescript">
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { Text } from 'shared/components'

    export let keyText: string = ''
    export let valueText: string = ''
    export let textColor: string = 'gray-600'
    export let darkTextColor: string = 'gray-600'
    export let backgroundColor: string = 'gray-50'
    export let darkBackgrounColor: string = 'gray-50'
    export let classes: string = ''
</script>

<block
    class={`w-full flex justify-between px-4 py-3.5 rounded-lg ${backgroundColor ? 'bg-' + backgroundColor : ''}  ${
        darkBackgrounColor ? 'dark:bg-' + darkBackgrounColor : ''
    } ${classes}`}
>
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
</block>
