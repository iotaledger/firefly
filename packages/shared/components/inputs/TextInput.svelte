<script lang="typescript">
    import { FontWeightText, TextType } from 'shared/components/Text.svelte'
    import Input from './Input.svelte'

    export let inputElement

    export let value: string
    export let hasFocus: boolean
    export let error = ''

    // Text Props
    export let type = TextType.p
    export let fontSize = '11'
    export let lineHeight = '140'
    export let fontWeight = FontWeightText.normal
    export let alignment: 'left' | 'right' | 'center' | 'justify' = 'left'
</script>

<Input
    bind:inputElement
    bind:value
    bind:hasFocus
    type="text"
    {error}
    textProps={{
        type,
        fontSize,
        lineHeight,
        fontWeight,
    }}
    {alignment}
    {...$$restProps}
/>
