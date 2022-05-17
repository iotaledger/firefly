<script lang="typescript">
    import { localize } from '@core/i18n'
    import { ADDRESS_LENGTH, validateBech32Address } from '@lib/utils'
    import { RecipientAccountSelector, TextInput, InputContainer, Modal } from 'shared/components'
    import { activeProfile } from '@core/profile'
    import { getNetwork, NetworkType, nodeInfo } from '@core/network'
    import { IAccountState } from '@core/account'
    export let recipient: string | IAccountState
    export let disabled = false

    const network = getNetwork($activeProfile.networkProtocol, $activeProfile.networkType)
    const addressPrefix = network?.type === NetworkType.PrivateNet ? $nodeInfo?.protocol?.bech32HRP : network?.bech32Hrp

    let inputElement
    let modal: Modal

    let selectedAccount: IAccountState
    let value: string
    let error: string
    let hasFocus: boolean

    $: recipient = selectedAccount ? selectedAccount : value
    $: hasFocus && (error = '')
    $: hasFocus && modal?.open()
    $: value && modal?.open()

    $: {
        if (inputElement && selectedAccount) {
            inputElement.value = selectedAccount?.getAlias()
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
