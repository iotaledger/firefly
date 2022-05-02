<script lang="typescript">
    import { TextInput } from 'shared/components'
    import { localize } from '@core/i18n'

    export let disabled = false
    export let hasFocus = false
    export let value
    export let integer
    let error
</script>

<TextInput
    bind:value
    bind:hasFocus
    {disabled}
    placeholder={localize('general.amount')}
    float={!integer}
    {integer}
    {...$$restProps}
/>
