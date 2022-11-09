<script lang="typescript">
    import { networkHrp } from '@core/network'
    import { validateBech32Address } from '@core/utils'
    import { Modal, SelectorInput } from 'shared/components'
    import { visibleActiveAccounts } from '@core/profile'

    export let recipient: string
    export let disabled = false

    const addressPrefix = $networkHrp

    let inputElement: HTMLInputElement = undefined
    let modal: Modal = undefined

    let error: string
    let selected

    const accountOptions = $visibleActiveAccounts?.map((account) => ({
        key: account.name,
        value: account.depositAddress,
    }))

    $: recipient = selected?.value

    export function validate(): Promise<void> {
        if (recipient) {
            return Promise.resolve()
        }

        error = validateBech32Address(addressPrefix, recipient)
        if (error) {
            return Promise.reject(error)
        }
        return Promise.resolve()
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
/>
