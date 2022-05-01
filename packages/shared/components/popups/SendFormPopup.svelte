<script lang="typescript">
    import { Button, Text, RecipientInput, AssetAmountInput } from 'shared/components'
    import { clearSendParams } from 'shared/lib/app'
    import { localize } from '@core/i18n'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { UNIT_MAP } from '@lib/units'

    let asset
    let amount
    let unit
    let recipient
    let validateRecipient = false

    const onSend = (): void => {
        validateRecipient = true
        const _amount = amount * UNIT_MAP[unit].val
        openPopup({
            type: 'sendConfirmation',
            props: {
                internal: false,
                amount: _amount,
                unit,
                to: recipient,
            },
        })
    }

    const onCancel = (): void => {
        clearSendParams()
        closePopup()
    }
</script>

<send-form-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type="h3" fontWeight={FontWeightText.semibold} classes="text-left">{localize('popups.sendForm.title')}</Text>
    <AssetAmountInput bind:asset bind:amount bind:unit />
    <RecipientInput bind:recipient bind:validate={validateRecipient} />
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" secondary onClick={onCancel}>
            {localize('actions.cancel')}
        </Button>
        <Button classes="w-full" onClick={onSend}>
            {localize('actions.send')}
        </Button>
    </popup-buttons>
</send-form-popup>
