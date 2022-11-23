<script lang="typescript">
    import { networkHrp } from '@core/network'
    import { validateBech32Address } from '@core/utils'
    import { Modal, SelectorInput, IOption, ColoredCircle } from 'shared/components'
    import { visibleActiveAccounts } from '@core/profile'
    import { getSubjectFromAddress, Subject } from '@core/wallet'
    import { getAccountColorById, selectedAccountIndex } from '@core/account'
    import { validateEthereumAddress } from '@core/layer-2'
    import { localize } from '@core/i18n'

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

    $: accountOptions = isLayer2 ? <IOption[]>[] : getLayer1AccountOptions()
    $: recipient = getSubjectFromAddress(selected?.value)
    $: isLayer2, (error = '')

    export function validate(): Promise<void> {
        if (recipient?.type === 'address') {
            if (!recipient.address) {
                error = localize('error.send.recipientRequired')
            }
            if (isLayer2) {
                error = validateEthereumAddress(recipient?.address)
            } else {
                error = validateBech32Address(addressPrefix, recipient?.address)
            }
        } else if (recipient?.type === 'account') {
            if (isLayer2) {
                error = localize('error.layer2.layer1Recipient')
            }
        } else {
            error = localize('error.send.recipientRequired')
        }

        if (error) {
            return Promise.reject(error)
        } else {
            return Promise.resolve()
        }
    }

    function getLayer1AccountOptions(): IOption[] {
        return $visibleActiveAccounts
            .filter((account) => account.index !== $selectedAccountIndex)
            .map((account) => ({
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
