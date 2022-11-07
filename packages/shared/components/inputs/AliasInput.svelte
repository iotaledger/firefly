<script lang="typescript">
    import { Modal, SelectorInput, Text, TextType } from 'shared/components'
    import { selectedAccount } from '@core/account'
    import { ADDRESS_TYPE_ALIAS, convertHexAddressToBech32 } from '@core/wallet'
    import { truncateString } from '@core/utils'

    export let alias: string = ''
    export let error: string = ''

    let inputElement: HTMLInputElement = undefined
    let modal: Modal = undefined

    $: aliasIds =
        $selectedAccount.balances?.aliases.map((hexAliasId) => {
            const aliasId = convertHexAddressToBech32(ADDRESS_TYPE_ALIAS, hexAliasId)
            return { value: aliasId, label: truncateString(aliasId, 9, 9) }
        }) ?? []

    export async function validate(): Promise<void> {
        if (!alias) {
            error = 'Alias is required'
            return Promise.reject(error)
        } else {
            return Promise.resolve()
        }
    }

    function onClick(selectedAlias: { value: string; label: string }): void {
        alias = selectedAlias.value
    }
</script>

<SelectorInput
    labelLocale="popups.mintNativeToken.property.alias"
    bind:value={alias}
    bind:inputElement
    bind:modal
    options={aliasIds}
    {error}
    {onClick}
    let:option
    let:index
>
    <Text type={TextType.pre} fontSize="sm" color="gray-600">Alias {index + 1}</Text>
    <Text type={TextType.pre} fontSize="sm" color="gray-600">{option.label}</Text>
</SelectorInput>
