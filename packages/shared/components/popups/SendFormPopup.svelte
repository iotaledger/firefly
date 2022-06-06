<script lang="typescript">
    import { Button, Text, RecipientInput, AssetAmountInput, PublicNoteInput } from 'shared/components'
    import { clearSendParams } from 'shared/lib/app'
    import { localize } from '@core/i18n'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { IAsset, Recipient } from '@core/wallet'

    let assetAmountInput
    let recipientInput

    let asset: IAsset
    let amount: string
    let rawAmount: number
    let unit: string
    let recipient: Recipient
    let publicNote: string

    async function onSend(): Promise<void> {
        let valid = true

        async function validate(): Promise<void> {
            await Promise.allSettled([
                assetAmountInput?.validate().then(
                    () => {},
                    () => {
                        valid = false
                    }
                ),
                recipientInput?.validate().then(
                    () => {},
                    () => {
                        valid = false
                    }
                ),
            ])
        }

        try {
            await validate()

            if (valid) {
                openPopup({
                    type: 'sendConfirmation',
                    props: {
                        internal: false,
                        rawAmount,
                        amount,
                        unit,
                        recipient,
                    },
                    overflow: true,
                })
            }
        } catch (error) {
            console.error('error: ', error)
        }
    }

    function onCancel(): void {
        clearSendParams()
        closePopup()
    }
</script>

<send-form-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type="h3" fontWeight={FontWeightText.semibold} classes="text-left">{localize('popups.sendForm.title')}</Text>
    <send-form-inputs class="flex flex-col space-y-4">
        <AssetAmountInput bind:this={assetAmountInput} bind:asset bind:rawAmount bind:amount bind:unit />
        <RecipientInput bind:this={recipientInput} bind:recipient />
        <PublicNoteInput bind:value={publicNote} />
    </send-form-inputs>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" secondary onClick={onCancel}>
            {localize('actions.cancel')}
        </Button>
        <Button classes="w-full" onClick={onSend}>
            {localize('actions.send')}
        </Button>
    </popup-buttons>
</send-form-popup>
