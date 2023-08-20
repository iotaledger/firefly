<script lang="ts">
    import { Modal, SelectorInput, IOption, ColoredCircle } from 'shared/components'
    import { selectedAccountIndex } from '@core/account/stores'
    import { getAccountColorById } from '@core/account/utils'
    import { localize } from '@core/i18n'
    import { visibleActiveAccounts } from '@core/profile/stores'
    import { validateBech32Address, validateEthereumAddress } from '@core/utils/crypto'
    import { Subject } from '@core/wallet/types'
    import { getSubjectFromAddress } from '@core/wallet/utils'
    import { Layer1RecipientError } from '@core/layer-2/errors'
    import { getNetworkHrp } from '@core/profile'

    export let recipient: Subject
    export let disabled = false
    export let isLayer2 = false

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
        try {
            if (recipient?.type === 'address') {
                if (!recipient.address) {
                    throw new Error(localize('error.send.recipientRequired'))
                }

                if (isLayer2) {
                    validateEthereumAddress(recipient?.address)
                } else {
                    validateBech32Address(getNetworkHrp(), recipient?.address)
                }
            } else if (recipient?.type === 'account') {
                if (isLayer2) {
                    throw new Layer1RecipientError()
                }
            } else {
                throw new Error(localize('error.send.recipientRequired'))
            }

            Promise.resolve()
        } catch (err) {
            error = err?.message ?? err
            return Promise.reject(error)
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
    pickerHeight="max-h-48"
    {...$$restProps}
    let:option
>
    {#if option?.id}
        <ColoredCircle color={getAccountColorById(option?.id)} />
    {/if}
</SelectorInput>
