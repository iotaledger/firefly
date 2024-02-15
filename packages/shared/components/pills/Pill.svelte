<script lang="ts">
    import { Text, FontWeight } from '@ui'

    export let data: string = ''
    export let textColor: string = 'gray-800'
    export let darkTextColor: string = ''
    export let backgroundColor: string = ''
    export let darkBackgroundColor: string = ''
    export let classes: string = ''
</script>

<Text
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
