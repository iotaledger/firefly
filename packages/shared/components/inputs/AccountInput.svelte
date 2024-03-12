<script lang="ts">
    import { Modal, SelectorInput, IOption } from '@ui'
    import { selectedWallet, AddressConverter } from '@core/wallet'
    import { localize } from '@core/i18n'
    import { validateBech32Address } from '@core/utils/crypto'
    import { getNetworkHrp } from '@core/profile/actions'
    import { AddressType } from '@iota/sdk/out/types'

    export let account: string = ''
    export let error: string = ''

    let inputElement: HTMLInputElement = undefined
    let modal: Modal = undefined

    const accountOptions: IOption[] =
        $selectedWallet?.balances?.accounts.map((hexAccountId: string, index: number) => {
            const accountAddress = AddressConverter.addressToBech32(hexAccountId)
            return { key: 'Account ' + (index + 1), value: accountAddress }
        }) ?? []

    let selected: IOption = accountOptions.find((option) => option.value === account)
    $: account = selected?.value

    export async function validate(): Promise<void> {
        try {
            if (!account) {
                throw new Error(localize('error.accountMinting.accountRequired'))
            }

            if (!accountOptions.some((option) => option.value === account)) {
                throw new Error(localize('error.accountMinting.accountNotInPossession'))
            }

            validateBech32Address(getNetworkHrp(), account, AddressType.Account)
        } catch (err) {
            error = err?.message ?? err
            return Promise.reject(error)
        }
    }
</script>

<SelectorInput
    labelLocale="popups.nativeToken.property.account"
    bind:selected
    bind:inputElement
    bind:modal
    options={accountOptions}
    {error}
/>
