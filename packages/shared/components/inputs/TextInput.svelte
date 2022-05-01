<script lang="typescript">
    import { FontWeightText } from 'shared/components/Text.svelte'
    import Input from './Input.svelte'

    export let value = ''
    export let classes = ''
    export let style = undefined
    export let label = undefined
    export let placeholder = undefined
    export let error: string
    export let maxlength = null
    export let autofocus = false
    export let submitHandler = undefined
    export let disabled = false
    export let isFocused = false
    export let disableContextMenu = false
    export let capsLockWarning = false
    export let hasFocus

    // Text Props
    export let type = 'p'
    export let fontSize = '11'
    export let lineHeight = '140'
    export let fontWeight = FontWeightText.normal
    export let alignment: 'left' | 'right' | 'center' | 'justify' = 'left'
</script>

<Input
    bind:value
    bind:hasFocus
    type="text"
    {label}
    {placeholder}
    {error}
    {maxlength}
    {disabled}
    {autofocus}
    {isFocused}
    {capsLockWarning}
    {disableContextMenu}
    {submitHandler}
    {style}
    {classes}
    textProps={{
        type,
        fontSize,
        lineHeight,
        fontWeight,
    }}
    {alignment}
    {...$$restProps}
/>
