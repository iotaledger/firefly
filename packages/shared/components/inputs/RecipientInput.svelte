<script lang="typescript">
    import { localize } from '@core/i18n'
    import { networkHrp } from '@core/network'
    import { Subject } from '@core/wallet'
    import { BECH32_ADDRESS_LENGTH, truncateString, validateBech32Address } from '@core/utils'
    import { Modal, AccountLabel, SelectorInput, Text, TextType } from 'shared/components'
    import { visibleActiveAccounts } from '@core/profile'
    import { IAccountState, selectedAccount } from '@core/account'

    export let recipient: Subject
    export let disabled = false

    const addressPrefix = $networkHrp

    let inputElement: HTMLInputElement = undefined
    let modal: Modal = undefined

    let selected: IAccountState
    let searchValue: string
    let error: string
    let previousValue: string

    if (!selected && recipient?.type === 'account') {
        selected = recipient?.account
    } else if (!selected && recipient?.type === 'address' && previousValue === searchValue) {
        searchValue = recipient?.address
    }

    $: recipient = {
        ...(selected && { type: 'account', account: selected }),
        ...(!selected && { type: 'address', address: searchValue }),
    }

    $: {
        if (inputElement && selected) {
            inputElement.value = selected?.name
        }
    }
    $: {
        if (searchValue) {
            selected = undefined
        }
    }

    export function validate(): Promise<void> {
        if (selectedAccount) {
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

    function getSuffixForAccount(account: IAccountState): string {
        return truncateString(account?.depositAddress, 10, 10)
    }

    function onClick(_selected: IAccountState): void {
        selected = _selected
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
    options={filteredAccounts}
    let:option
>
    <AccountLabel account={option} />
    <Text type={TextType.pre} fontSize="sm" color="gray-600">{getSuffixForAccount(option)}</Text>
</SelectorInput>
