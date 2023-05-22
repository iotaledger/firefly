<script lang="ts">
    import { NumberInput, FontWeight } from 'shared/components'

    export let inputElement: HTMLInputElement | undefined = undefined
    export let fontSize = 24
    export let fontWeight = FontWeight.semibold
    export let disabled = false
    export let hasFocus = false
    export let amount: string = ''
</script>

<NumberInput
    bind:inputElement
    bind:value={amount}
    bind:hasFocus
    {disabled}
    placeholder="0"
    {fontSize}
    alignment="right"
    {fontWeight}
    {...$$restProps}
/>
