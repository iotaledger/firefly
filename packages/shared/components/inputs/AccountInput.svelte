<script lang="ts">
    import { Modal, SelectorInput, IOption } from 'shared/components'
    import { selectedWallet } from '@core/wallet/stores'
    import { localize } from '@core/i18n'
    import { validateBech32Address } from '@core/utils/crypto'
    import { ADDRESS_TYPE_ACCOUNT } from '@core/wallet/constants'
    import { getNetworkHrp } from '@core/profile/actions'
    import { api } from '@core/api'

    export let account: string = ''
    export let error: string = ''

    let inputElement: HTMLInputElement = undefined
    let modal: Modal = undefined

    const accountOptions: IOption[] =
        $selectedWallet.balances?.accounts.map((hexAccountId: string, index: number) => {
            const accountId = api.accountIdToBech32(hexAccountId, getNetworkHrp())
            return { key: 'Account' + (index + 1), value: accountId }
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

            validateBech32Address(getNetworkHrp(), account, ADDRESS_TYPE_ACCOUNT)
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
