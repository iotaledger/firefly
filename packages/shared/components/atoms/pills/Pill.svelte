<script lang="typescript">
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { Text } from 'shared/components'

    export let data: string = ''
    export let textColor: string = 'gray-800'
    export let darkTextColor: string = ''
    export let backgroundColor: string = ''
    export let darkBackgrounColor: string = ''
    export let classes: string = ''
</script>

<Text
    type="p"
    fontSize="12"
    fontWeight={FontWeightText.semibold}
    color={textColor}
    darkColor={darkTextColor || textColor}
    classes={`px-2 py-1 rounded-md ${backgroundColor ? 'bg-' + backgroundColor : ''}  ${
        darkBackgrounColor ? 'dark:bg-' + darkBackgrounColor : ''
    } ${classes}`}
>
    {#if data}
        {data}
    {:else}
        <slot />
    {/if}
</Text>
