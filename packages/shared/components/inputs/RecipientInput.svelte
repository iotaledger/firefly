<script lang="typescript">
    import { networkHrp } from '@core/network'
    import { validateBech32Address } from '@core/utils'
    import { Modal, SelectorInput, IOption, ColoredCircle } from 'shared/components'
    import { visibleActiveAccounts } from '@core/profile'
    import { getSubjectFromAddress, Subject } from '@core/wallet'
    import { getAccountColorById, selectedAccountIndex } from '@core/account'
    import { validateEthereumAddress } from '@core/layer-2'

    export let recipient: Subject
    export let disabled = false
    export let isLayer2 = false

    const addressPrefix = $networkHrp

    let inputElement: HTMLInputElement = undefined
    let modal: Modal = undefined

    let error: string
    let selected: IOption =
        recipient?.type === 'account'
            ? { key: recipient.account.name, value: recipient.account.depositAddress }
            : { value: recipient?.address }

    const accountOptions: IOption[] = isLayer2 ? [] : getLayer1AccountOptions()

    $: recipient = getSubjectFromAddress(selected?.value)

    export function validate(): Promise<void> {
        if (recipient?.type === 'address') {
            if (!recipient.address) {
                error = 'Recipient is required'
                return Promise.reject(error)
            }
            if (isLayer2) {
                error = validateEthereumAddress(recipient?.address)
            } else {
                error = validateBech32Address(addressPrefix, recipient?.address)
            }
            if (error) {
                return Promise.reject(error)
            }
        }
        return Promise.resolve()
    }

    function getLayer1AccountOptions(): IOption[] {
        return $visibleActiveAccounts
            ?.filter((account) => account.index !== $selectedAccountIndex)
            ?.map((account) => ({
                id: account.index,
                key: account.name,
                value: account.depositAddress,
            }))
    }
</script>

<SelectorInput
    labelLocale="general.recipient"
    bind:selected
    bind:inputElement
    bind:modal
    bind:error
    {disabled}
    options={accountOptions}
    {...$$restProps}
    let:option
>
    <ColoredCircle color={getAccountColorById(option?.id)} />
</SelectorInput>
