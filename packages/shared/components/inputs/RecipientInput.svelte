<script lang="typescript">
    import { IAccountState } from '@core/account'
    import { localize } from '@core/i18n'
    import { networkHrp } from '@core/network'
    import { Subject } from '@core/wallet'
    import { BECH32_ADDRESS_CHARACTER_LENGTH, validateBech32Address } from '@core/utils'
    import { InputContainer, Modal, RecipientAccountSelector, TextInput } from 'shared/components'

    export let recipient: Subject
    export let disabled = false

    const addressPrefix = $networkHrp

    let inputElement: HTMLInputElement
    let modal: Modal

    let selectedAccount: IAccountState
    let value: string
    let error: string
    let hasFocus: boolean
    let previousValue: string

    if (!selectedAccount && recipient?.type === 'account') {
        selectedAccount = recipient?.account
    } else if (!selectedAccount && recipient?.type === 'address' && previousValue === value) {
        value = recipient?.address
    }

    $: recipient = {
        ...(selectedAccount && { type: 'account', account: selectedAccount }),
        ...(!selectedAccount && { type: 'address', address: value }),
    }

    $: hasFocus && (error = '')
    $: value && modal?.open()

    $: if (hasFocus) {
        setTimeout(() => modal?.open(), 101)
    }

    $: {
        if (inputElement && selectedAccount) {
            inputElement.value = selectedAccount?.name
        }
    }
    $: {
        if (value) {
            selectedAccount = undefined
        }
    }

    export function validate(): Promise<void> {
        if (selectedAccount) {
            return Promise.resolve()
        }

        if (value.length !== BECH32_ADDRESS_CHARACTER_LENGTH + addressPrefix.length) {
            error = localize('error.send.addressLength', {
                values: {
                    length: BECH32_ADDRESS_CHARACTER_LENGTH + addressPrefix.length,
                },
            })
        } else {
            error = validateBech32Address(addressPrefix, value)
        }

        if (error) {
            return Promise.reject(error)
        }
        return Promise.resolve()
    }
</script>

<recipient-input class="w-full relative">
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
    <RecipientAccountSelector
        bind:modal
        bind:selected={selectedAccount}
        searchValue={value}
        onClose={() => inputElement.blur()}
    />
</recipient-input>
