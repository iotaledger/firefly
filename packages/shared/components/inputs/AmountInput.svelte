<script lang="typescript">
    import { NumberInput } from 'shared/components'
    import { localize } from '@core/i18n'
    import { FontWeight } from 'shared/components/Text.svelte'

    export let inputElement: HTMLInputElement
    export let disabled = false
    export let hasFocus = false
    export let amount: string
</script>

<NumberInput
    bind:inputElement
    bind:value={amount}
    bind:hasFocus
    {disabled}
    placeholder={localize('general.amount')}
    fontSize="24"
    alignment="right"
    fontWeigth={FontWeight.semibold}
    {...$$restProps}
/>
