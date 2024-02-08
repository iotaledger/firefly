<script lang="ts">
    import { Modal, SelectorInput, IOption, ColoredCircle } from 'shared/components'
    import { localize } from '@core/i18n'
    import { validateBech32Address, validateEthereumAddress } from '@core/utils/crypto'
    import { Subject } from '@core/wallet/types'
    import { getSubjectFromAddress } from '@core/wallet/utils'
    import { Layer1RecipientError } from '@core/layer-2/errors'
    import { getNetworkHrp, getWalletColorById, visibleActiveWallets } from '@core/profile'
    import { selectedWalletId } from '@core/wallet/stores'
    import { SubjectType } from '@core/wallet'

    export let recipient: Subject
    export let disabled = false
    export let isLayer2 = false

    let inputElement: HTMLInputElement = undefined
    let modal: Modal = undefined

    let error: string
    let selected: IOption =
        recipient?.type === SubjectType.Wallet
            ? { key: recipient.wallet.name, value: recipient.wallet.depositAddress }
            : { value: recipient?.address }

    $: walletOptions = isLayer2 ? <IOption[]>[] : getLayer1WalletOptions()
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
            } else if (recipient?.type === SubjectType.Wallet) {
                if (isLayer2) {
                    throw new Layer1RecipientError()
                }
            } else {
                throw new Error(localize('error.send.recipientRequired'))
            }

            return Promise.resolve()
        } catch (err) {
            error = err?.message ?? err
            return Promise.reject(error)
        }
    }

    function getLayer1WalletOptions(): IOption[] {
        return $visibleActiveWallets
            .filter((wallet) => wallet.id !== $selectedWalletId)
            .map((wallet) => ({
                id: wallet.id,
                key: wallet.name,
                value: wallet.depositAddress,
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
    options={walletOptions}
    pickerHeight="max-h-48"
    {...$$restProps}
    let:option
>
    {#if option?.id}
        <ColoredCircle color={getWalletColorById(option?.id)} />
    {/if}
</SelectorInput>
