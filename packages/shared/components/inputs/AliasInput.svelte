<script lang="typescript">
    import { Modal, SelectorInput, IOption } from 'shared/components'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { networkHrp } from '@core/network/stores'
    import { validateBech32Address } from '@core/utils/crypto'
    import { ADDRESS_TYPE_ALIAS } from '@core/wallet/constants'
    import { convertHexAddressToBech32 } from '@core/wallet/utils'

    export let alias: string = ''
    export let error: string = ''

    let inputElement: HTMLInputElement = undefined
    let modal: Modal = undefined

    const aliasOptions: IOption[] =
        $selectedAccount.balances?.aliases.map((hexAliasId, index) => {
            const aliasId = convertHexAddressToBech32(ADDRESS_TYPE_ALIAS, hexAliasId)
            return { key: 'Alias ' + (index + 1), value: aliasId }
        }) ?? []

    let selected: IOption = aliasOptions.find((option) => option.value === alias)
    $: alias = selected?.value

    export async function validate(): Promise<void> {
        if (!alias) {
            error = localize('error.aliasMinting.aliasRequired')
            return Promise.reject(error)
        }

        try {
            validateBech32Address($networkHrp, alias, ADDRESS_TYPE_ALIAS)
            if (isAliasInPossession()) {
                return Promise.resolve()
            } else {
                error = localize('error.aliasMinting.aliasNotInPossession')
                return Promise.reject(error)
            }
        } catch (err) {
            error = err?.message ?? err
            return Promise.reject(error)
        }
    }

    function isAliasInPossession(): boolean {
        return aliasOptions.some((option) => option.value === alias)
    }
</script>

<SelectorInput
    labelLocale="popups.nativeToken.property.alias"
    bind:selected
    bind:inputElement
    bind:modal
    options={aliasOptions}
    {error}
/>
