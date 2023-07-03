<script lang="ts">
    import { Text, FontWeight, TextType } from 'shared/components'

    export let data: string | undefined = undefined
    export let textColor: string = 'gray-800'
    export let darkTextColor: string | undefined = undefined
    export let backgroundColor: string | undefined = undefined
    export let darkBackgroundColor: string | undefined = undefined
    export let classes: string | undefined = undefined
</script>

<Text
    type={TextType.p}
    smaller
    fontWeight={FontWeight.semibold}
    color={textColor}
    darkColor={darkTextColor || textColor}
    classes="px-2.5 py-1 rounded-2xl
        {backgroundColor ? 'bg-' + backgroundColor : ''}
        {darkBackgroundColor ? 'dark:bg-' + darkBackgroundColor : ''}
        {classes}
    "
>
    {#if data}
        <slot />
        {data}
    {:else}
        <slot />
    {/if}
</Text>
