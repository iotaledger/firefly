<script lang="ts">
    import { Text, FontWeight } from '@ui'

    export let data: string = ''
    export let textColor: string = 'gray-800'
    export let darkTextColor: string = ''
    export let backgroundColor: string = ''
    export let darkBackgroundColor: string = ''
    export let classes: string = ''
    export let clearPadding: boolean = false
</script>

<Text
    smaller
    fontWeight={FontWeight.semibold}
    color={textColor}
    darkColor={darkTextColor || textColor}
    classes="rounded-2xl
        {backgroundColor ? 'bg-' + backgroundColor : ''}
        {darkBackgroundColor ? 'dark:bg-' + darkBackgroundColor : ''}
        {classes}
        {clearPadding ? '' : 'px-2.5 py-1'}
    "
>
    {#if data}
        <slot />
        {data}
    {:else}
        <slot />
    {/if}
</Text>
