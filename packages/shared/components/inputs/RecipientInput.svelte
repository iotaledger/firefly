<script lang="typescript">
    import { localize } from '@core/i18n'
    import { WalletAccount } from '@lib/typings/wallet'
    import { ADDRESS_LENGTH, validateBech32Address } from '@lib/utils'
    import { RecipientAccountSelector, TextInput, InputContainer } from 'shared/components'

    export let recipient: string | WalletAccount = undefined
    export let disabled = false

    // TODO: get ADDRESS_PREFIX from profile network info
    const ADDRESS_PREFIX = 'atoi'

    let inputElement
    let modal
    let selectedAccount: WalletAccount

    let value
    let error
    let hasFocus

    $: recipient = selectedAccount ? selectedAccount : value
    $: hasFocus && (error = '')
    $: hasFocus && modal?.open()
    $: value && modal?.open()

    $: {
        if (inputElement && selectedAccount) {
            inputElement.value = selectedAccount?.alias
        }
    }
    $: {
        if (value) {
            selectedAccount = undefined
        }
    }

    export function validate(): Promise<any> {
        if (selectedAccount) {
            return Promise.resolve()
        } else if (value.length !== ADDRESS_LENGTH + ADDRESS_PREFIX.length) {
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

<recipient-input class="w-full">
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
    <RecipientAccountSelector bind:modal bind:selected={selectedAccount} searchValue={value} />
</recipient-input>
