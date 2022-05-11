<script lang="typescript">
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { Text } from 'shared/components'

    export let data = ''
    export let textColor = 'gray-800'
    export let darkTextColor = ''
    export let backgroundColor = ''
    export let darkBackgroundColor = ''
    export let smaller = false
    export let classes = ''

    $: conditionalProps = smaller
        ? {
              smaller: true,
              fontSize: '',
          }
        : {
              smaller: false,
              fontSize: '12',
          }
</script>

<Text
    type="p"
    fontWeight={FontWeightText.semibold}
    color={textColor}
    darkColor={darkTextColor || textColor}
    classes="px-2 py-1 rounded-md
        {backgroundColor ? 'bg-' + backgroundColor : ''}
        {darkBackgroundColor ? 'dark:bg-' + darkBackgroundColor : ''}
        {classes}
    "
    {...conditionalProps}
>
    {#if data}
        {data}
    {:else}
        <slot />
    {/if}
</Text>
