<script lang="typescript">
    import { TextInput } from 'shared/components'
    import { localize } from '@core/i18n'

    export let disabled = false
    export let isFocused = false
    export let amount
    let error
</script>

<TextInput
    bind:value={amount}
    bind:hasFocus={isFocused}
    {disabled}
    placeholder={localize('general.amount')}
    {...$$restProps}
/>
