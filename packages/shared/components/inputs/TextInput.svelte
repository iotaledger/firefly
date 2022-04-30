<script lang="typescript">
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
    {...$$restProps}
/>
