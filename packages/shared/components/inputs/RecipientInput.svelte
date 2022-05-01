<script lang="typescript">
    import TextInput from './TextInput.svelte'
    import { localize } from '@core/i18n'
    import { ADDRESS_LENGTH, validateBech32Address } from '@lib/utils'
    import InputContainer from './InputContainer.svelte'

    export let recipient = undefined
    export let disabled = false
    export let validate = false

    // TODO: get ADDRESS_PREFIX from profile network info
    const ADDRESS_PREFIX = 'atoi'

    let value
    let error
    let hasFocus

    function validateInput() {
        if (value.length !== ADDRESS_LENGTH + ADDRESS_PREFIX.length) {
            error = localize('error.send.addressLength', {
                values: {
                    length: ADDRESS_LENGTH + ADDRESS_PREFIX.length,
                },
            })
        } else {
            error = validateBech32Address(ADDRESS_PREFIX, value)
        }
        validate = false
    }

    $: recipient = value
    $: validate && validateInput()
    $: hasFocus && (error = '')
</script>

<InputContainer clearPadding>
    <TextInput
        bind:value
        bind:hasFocus
        clearBackground
        clearBorder
        {error}
        {disabled}
        label={localize('general.recipient')}
        placeholder={localize('general.recipient')}
        {...$$restProps}
    />
</InputContainer>
