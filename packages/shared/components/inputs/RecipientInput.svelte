<script lang="typescript">
    import TextInput from './TextInput.svelte'
    import { localize } from '@core/i18n'
    import { ADDRESS_LENGTH, validateBech32Address } from '@lib/utils'
    import InputContainer from './InputContainer.svelte'

    export let recipient = undefined
    export let disabled = false

    // TODO: get ADDRESS_PREFIX from profile network info
    const ADDRESS_PREFIX = 'atoi'

    let inputElement
    let value
    let error
    let hasFocus

    $: recipient = value
    $: hasFocus && (error = '')

    export function validate(): Promise<any> {
        if (value.length !== ADDRESS_LENGTH + ADDRESS_PREFIX.length) {
            error = localize('error.send.addressLength', {
                values: {
                    length: ADDRESS_LENGTH + ADDRESS_PREFIX.length,
                },
            })
        } else {
            error = validateBech32Address(ADDRESS_PREFIX, value)
        }

        if (error) {
            return Promise.reject(error)
        } else {
            return Promise.resolve()
        }
    }
</script>

<InputContainer bind:inputElement clearPadding isFocused={hasFocus} {error}>
    <TextInput
        bind:inputElement
        bind:value
        bind:hasFocus
        clearBackground
        clearBorder
        {disabled}
        label={localize('general.recipient')}
        placeholder={localize('general.recipient')}
        fontSize="sm"
        {...$$restProps}
    />
</InputContainer>
