<script lang="typescript">
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { Text } from 'shared/components'

    export let data = ''
    export let textColor = 'gray-800'
    export let darkTextColor = ''
    export let backgroundColor = ''
    export let darkBackgroundColor = ''
    export let classes = ''
</script>

<Text
    type="p"
    smaller
    fontWeight={FontWeightText.semibold}
    color={textColor}
    darkColor={darkTextColor || textColor}
    classes="px-2 py-1 rounded-md
        {backgroundColor ? 'bg-' + backgroundColor : ''}
        {darkBackgroundColor ? 'dark:bg-' + darkBackgroundColor : ''}
        {classes}
    "
>
    {#if data}
        {data}
    {:else}
        <slot />
    {/if}
</Text>
