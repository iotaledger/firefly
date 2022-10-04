<script lang="typescript">
    import { NumberInput, FontWeight } from 'shared/components'

    export let inputElement: HTMLInputElement = undefined
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
    fontSize="24"
    alignment="right"
    fontWeigth={FontWeight.semibold}
    {...$$restProps}
/>
