<script lang="typescript">
    import { NumberInput } from 'shared/components'
    import { localize } from '@core/i18n'
    import { FontWeightText } from 'shared/components/Text.svelte'

    export let disabled = false
    export let isFocused = false
    export let amount
    let error
</script>

<NumberInput
    bind:value={amount}
    bind:hasFocus={isFocused}
    {disabled}
    placeholder={localize('general.amount')}
    fontSize="24"
    alignment="right"
    fontWeigth={FontWeightText.semibold}
    {...$$restProps}
/>
