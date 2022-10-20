<script lang="typescript">
    import { IAccountState } from '@core/account'
    import { localize } from '@core/i18n'
    import { networkHrp } from '@core/network'
    import { Subject } from '@core/wallet'
    import { BECH32_ADDRESS_LENGTH, validateBech32Address } from '@core/utils'
    import { Modal, RecipientAccountSelector, SelectorInput } from 'shared/components'

    export let recipient: Subject
    export let disabled = false

    const addressPrefix = $networkHrp

    let inputElement: HTMLInputElement = undefined
    let modal: Modal = undefined

    let selectedAccount: IAccountState
    let value: string
    let error: string
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

        if (value.length !== BECH32_ADDRESS_LENGTH + addressPrefix.length) {
            error = localize('error.send.addressLength', {
                values: {
                    length: BECH32_ADDRESS_LENGTH + addressPrefix.length,
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

<SelectorInput labelLocale="general.recipient" bind:value bind:inputElement bind:modal bind:error {disabled}>
    <RecipientAccountSelector
        bind:modal
        bind:selected={selectedAccount}
        searchValue={value}
        onClose={() => inputElement.blur()}
    />
</SelectorInput>
