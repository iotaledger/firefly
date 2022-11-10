<script lang="typescript">
    import { Modal, SelectorInput, IOption } from 'shared/components'
    import { selectedAccount } from '@core/account'
    import { ADDRESS_TYPE_ALIAS, convertHexAddressToBech32 } from '@core/wallet'
    import { validateBech32Address } from '@core/utils'
    import { networkHrp } from '@core/network'
    import { localize } from '@core/i18n'

    export let alias: string = ''
    export let error: string = ''

    let inputElement: HTMLInputElement = undefined
    let modal: Modal = undefined
    let selected: IOption = { value: alias }

    const aliasOptions: IOption[] =
        $selectedAccount.balances?.aliases.map((hexAliasId, index) => {
            const aliasId = convertHexAddressToBech32(ADDRESS_TYPE_ALIAS, hexAliasId)
            return { key: 'Alias ' + (index + 1), value: aliasId }
        }) ?? []

    $: alias = selected?.value

    export async function validate(): Promise<void> {
        if (!alias) {
            error = localize('error.aliasMinting.aliasRequired')
            return Promise.reject(error)
        }
        const addressValidationError = validateBech32Address($networkHrp, alias, ADDRESS_TYPE_ALIAS)
        if (addressValidationError) {
            error = addressValidationError
            return Promise.reject(error)
        } else if (!isAliasInPossession()) {
            error = localize('error.aliasMinting.aliasNotInPossession')
            return Promise.reject(error)
        } else {
            return Promise.resolve()
        }
    }

    function isAliasInPossession(): boolean {
        return aliasOptions.some((option) => option.value === alias)
    }
</script>

<SelectorInput
    labelLocale="popups.mintNativeToken.property.alias"
    bind:selected
    bind:inputElement
    bind:modal
    options={aliasOptions}
    {error}
/>
