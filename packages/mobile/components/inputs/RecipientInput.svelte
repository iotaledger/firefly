<script lang="typescript">
    import { IAccountState } from '@core/account'
    import { localize } from '@core/i18n'
    // import { networkHrp } from '@core/network'
    // import { BECH32_ADDRESS_LENGTH, validateBech32Address } from '@core/utils'
    import { Subject } from '@core/wallet'

    export let recipient: Subject
    export let disabled = false

    // const addressPrefix = $networkHrp

    let inputElement: HTMLInputElement = undefined

    let selectedAccount: IAccountState
    let value: string
    // let error: string
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

    // function isValid(): boolean {
    //     if (selectedAccount) {
    //         return true
    //     }

    //     if (value.length !== BECH32_ADDRESS_LENGTH + addressPrefix.length) {
    //         error = localize('error.send.addressLength', {
    //             values: {
    //                 length: BECH32_ADDRESS_LENGTH + addressPrefix.length,
    //             },
    //         })
    //     } else {
    //         error = validateBech32Address(addressPrefix, value)
    //     }

    //     if (error) {
    //         return false
    //     }
    //     return true
    // }
</script>

<div class="flex flex-row space-x-3">
    <span>Recipient: </span>
    <input
        type="text"
        {value}
        bind:this={inputElement}
        class="w-full"
        {disabled}
        placeholder={localize('general.enterAddress')}
        spellcheck={false}
    />
</div>
