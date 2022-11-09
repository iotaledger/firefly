<script lang="typescript">
    import { localize } from '@core/i18n'
    import { networkHrp } from '@core/network'
    import { Subject } from '@core/wallet'
    import { BECH32_ADDRESS_LENGTH, validateBech32Address } from '@core/utils'
    import { Modal, SelectorInput } from 'shared/components'
    import { visibleActiveAccounts } from '@core/profile'
    import { IAccountState, selectedAccount } from '@core/account'

    export let recipient: Subject
    export let disabled = false

    const addressPrefix = $networkHrp

    let inputElement: HTMLInputElement = undefined
    let modal: Modal = undefined

    let account: IAccountState
    let searchValue: string
    let error: string
    let previousValue: string

    const accountOptions = $visibleActiveAccounts?.filter((account) => ({
        key: account.name,
        value: account.depositAddress,
    }))

    if (!account && recipient?.type === 'account') {
        account = recipient?.account
    } else if (!account && recipient?.type === 'address' && previousValue === searchValue) {
        searchValue = recipient?.address
    }

    $: recipient = {
        ...(account && { type: 'account', account }),
        ...(!account && { type: 'address', address: searchValue }),
    }

    $: {
        if (inputElement && account) {
            inputElement.value = account?.name
        }
    }
    $: {
        if (searchValue) {
            account = undefined
        }
    }

    export function validate(): Promise<void> {
        if (account) {
            return Promise.resolve()
        }

        if (searchValue.length !== BECH32_ADDRESS_LENGTH + addressPrefix.length) {
            error = localize('error.send.addressLength', {
                values: {
                    length: BECH32_ADDRESS_LENGTH + addressPrefix.length,
                },
            })
        } else {
            error = validateBech32Address(addressPrefix, searchValue)
        }

        if (error) {
            return Promise.reject(error)
        }
        return Promise.resolve()
    }

    $: filteredAccounts = $visibleActiveAccounts?.filter(
        (account) =>
            (account.index !== $selectedAccount.index &&
                account.name.toLowerCase().includes(searchValue?.toLowerCase() ?? '')) ||
            account.depositAddress.toLowerCase().includes(searchValue?.toLowerCase() ?? '')
    )

    function onClick(_selectedAccount: IAccountState): void {
        account = _selectedAccount
    }
</script>

<SelectorInput
    labelLocale="general.recipient"
    bind:value={searchValue}
    bind:inputElement
    bind:modal
    bind:error
    {onClick}
    {disabled}
    options={accountOptions}
    {...$$restProps}
/>
