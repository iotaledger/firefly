<script lang="ts">
    import { Text, FontWeight } from 'shared/components'

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
