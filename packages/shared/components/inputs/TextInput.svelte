<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import Input from './Input.svelte'
    import { FontWeight, InputType, TextPropTypes, TextType } from 'shared/components'

    export let value: string = ''
    export let inputElement: HTMLInputElement | undefined = undefined
    export let hasFocus: boolean = false
    export let error: string = ''
    export let inputType: InputType = InputType.Text
    export let alignment: 'left' | 'right' | 'center' | 'justify' = 'left'

    // Text Props
    export let textType = TextType.p
    export let fontWeight: FontWeight = FontWeight.normal
    export let fontSize = 'sm'
    export let lineHeight = '140'

    const dispatch = createEventDispatcher()

    let textProps: TextPropTypes
    $: textProps = { type: textType, fontSize, lineHeight, fontWeight }
</script>

<Input
    bind:inputElement
    bind:value
    bind:hasFocus
    bind:error
    type={inputType}
    {textProps}
    {alignment}
    on:blur={() => dispatch('blur')}
    {...$$restProps}
>
    <slot name="left" slot="left" />
    <slot name="right" slot="right" />
    <slot name="right-full-h" slot="right-full-h" />
</Input>
