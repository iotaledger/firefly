<script lang="typescript">
    import Input from './Input.svelte'
    import { FontWeight, TextPropTypes, TextType } from 'shared/components/Text.svelte'

    export let inputElement: HTMLInputElement
    export let hasFocus: boolean = false
    export let value: string
    export let error: string

    // Text Props
    export let type = TextType.p
    export let fontWeight = FontWeight.normal
    export let fontSize = 'sm'
    export let lineHeight = '140'
    export let alignment: 'left' | 'right' | 'center' | 'justify' = 'left'

    let textProps: TextPropTypes
    $: textProps = { type, fontSize, lineHeight, fontWeight }
</script>

<Input bind:inputElement bind:value bind:hasFocus type="text" {error} {textProps} {alignment} {...$$restProps}>
    <slot />
</Input>
