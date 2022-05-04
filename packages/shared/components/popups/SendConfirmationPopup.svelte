<script lang="typescript">
    import { Unit } from '@iota/unit-converter'
    import { Button, Text } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { localize } from '@core/i18n'
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { TransactionDetails } from 'shared/components/molecules'

    export let internal = false
    export let to = ''
    export let amount = 0
    export let unit = Unit.i

    export let onConfirm = (..._: any[]): void => {}

    function onCancel() {
        closePopup()
    }

    $: transactionDetails = {
        type: internal ? 'transferring' : 'sending',
        value: amount,
        unit,
        ...(internal && { account: to }),
        ...(!internal && { address: to }),
    }
</script>

<send-confirmation-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type="h3" fontWeight={FontWeightText.semibold} classes="text-left"
        >{localize('popups.transaction.title')}</Text
    >
    <TransactionDetails {...transactionDetails} />
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" secondary onClick={onCancel}>{localize('actions.cancel')}</Button>
        <Button classes="w-full" onClick={onConfirm}>{localize('actions.confirm')}</Button>
    </popup-buttons>
</send-confirmation-popup>
