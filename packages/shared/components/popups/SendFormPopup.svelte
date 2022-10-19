<script lang="typescript">
    import { get } from 'svelte/store'
    import { localize } from '@core/i18n'
    import { newTransactionDetails, updateNewTransactionDetails } from '@core/wallet'
    import {
        Button,
        Text,
        TextType,
        RecipientInput,
        AssetAmountInput,
        FontWeight,
        NetworkInput,
    } from 'shared/components'
    import { closePopup, openPopup } from '@auxiliary/popup'
    import type { DestinationNetwork } from '@core/network'

    let { asset, rawAmount, unit, recipient } = get(newTransactionDetails)
    let assetAmountInput: AssetAmountInput
    let recipientInput: RecipientInput

    let network: DestinationNetwork

    async function onSend(): Promise<void> {
        const valid = await validate()
        if (valid) {
            updateNewTransactionDetails({ asset, rawAmount, unit, recipient })
            // TODO: Update flow
            openPopup({
                type: 'sendConfirmation',
                overflow: true,
            })
        }
    }

    async function validate(): Promise<boolean> {
        try {
            await Promise.all([assetAmountInput?.validate(), recipientInput?.validate()])
            return true
        } catch (error) {
            console.error('Error: ', error)
            return false
        }
    }

    function onCancel(): void {
        closePopup()
    }
</script>

<send-form-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.sendForm.title')}
    </Text>
    <send-form-inputs class="flex flex-col space-y-4">
        <AssetAmountInput bind:this={assetAmountInput} bind:asset bind:rawAmount bind:unit />
        <NetworkInput bind:network />
        <RecipientInput bind:this={recipientInput} bind:recipient />
    </send-form-inputs>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onCancel}>
            {localize('actions.cancel')}
        </Button>
        <Button classes="w-full" onClick={onSend}>
            {localize('actions.send')}
        </Button>
    </popup-buttons>
</send-form-popup>
