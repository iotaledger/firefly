<script lang="typescript">
    import { localize } from '@core/i18n'
    import { WalletAccount } from '@lib/typings/walletAccount'
    import { ADDRESS_LENGTH, validateBech32Address } from '@lib/utils'
    import { RecipientAccountSelector, TextInput, InputContainer, Modal } from 'shared/components'
    import { activeProfile } from '@lib/profile'
    import { getNetwork } from '@core/network'

    export let recipient: string | WalletAccount
    export let disabled = false

    const addressPrefix = getNetwork($activeProfile.networkProtocol, $activeProfile.networkType)?.bech32Hrp

    let inputElement
    let modal: Modal

    let selectedAccount: WalletAccount
    let value: string
    let error: string
    let hasFocus: boolean

    $: recipient = selectedAccount ? selectedAccount : value
    $: hasFocus && (error = '')
    $: hasFocus && modal?.open()
    $: value && modal?.open()

    $: {
        if (inputElement && selectedAccount) {
            inputElement.value = selectedAccount?.alias()
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
        } else if (value.length !== ADDRESS_LENGTH + addressPrefix.length) {
            error = localize('error.send.addressLength', {
                values: {
                    length: ADDRESS_LENGTH + addressPrefix.length,
                },
            })
        } else {
            error = validateBech32Address(addressPrefix, value)
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
