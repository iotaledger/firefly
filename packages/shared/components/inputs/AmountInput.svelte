<script lang="ts">
    import { NumberInput, FontWeight } from 'shared/components'

    export let inputElement: HTMLInputElement | undefined = undefined
    export let fontSize = 24
    export let fontWeight = FontWeight.semibold
    export let disabled = false
    export let hasFocus = false
    export let amount: string = ''

    $: amount, addLeadingZeroToDecimalSeparator()

    function addLeadingZeroToDecimalSeparator(): void {
        if (amount?.[0] === '.' || amount?.[0] === ',') {
            amount = '0' + amount
        }
    }
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
