<script lang="typescript">
    import { get } from 'svelte/store'
    import { localize } from '@core/i18n'
    import { newTransactionDetails, updateNewTransactionDetails } from '@core/wallet'
    import { Button, Text, RecipientInput, AssetAmountInput, OptionalInput, FontWeight } from 'shared/components'
    import { closePopup, openPopup } from '@lib/popup'
    import { getByteLengthOfString } from '@lib/utils/getByteLengthOfString'

    let { asset, rawAmount, unit, recipient, metadata, tag } = get(newTransactionDetails)
    let assetAmountInput: AssetAmountInput
    let recipientInput: RecipientInput
    let metadataInput: OptionalInput
    let tagInput: OptionalInput

    async function onSend(): Promise<void> {
        const valid = await validate()
        if (valid) {
            updateNewTransactionDetails({ asset, rawAmount, unit, recipient, metadata, tag })
            openPopup({
                type: 'sendConfirmation',
                overflow: true,
            })
        }
    }

    function validateOptionalInput(value: string, byteLimit: number, errorMessage: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (getByteLengthOfString(value) > byteLimit) {
                reject(errorMessage)
            }
            resolve()
        })
    }

    async function validate(): Promise<boolean> {
        try {
            await Promise.all([
                assetAmountInput?.validate(),
                recipientInput?.validate(),
                metadataInput?.validate(validateOptionalInput(metadata, 8192, localize('error.send.metadataTooLong'))),
                tagInput?.validate(validateOptionalInput(tag, 64, localize('error.send.tagTooLong'))),
            ])
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
    <Text type="h3" fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.sendForm.title')}
    </Text>
    <send-form-inputs class="flex flex-col space-y-4">
        <AssetAmountInput bind:this={assetAmountInput} bind:asset bind:rawAmount bind:unit />
        <RecipientInput bind:this={recipientInput} bind:recipient />
        <optional-inputs class="flex flex-row flex-wrap gap-4">
            <OptionalInput
                bind:this={metadataInput}
                bind:value={metadata}
                label={localize('general.metadata')}
                description={localize('tooltips.optionalInput')}
            />
            <OptionalInput
                bind:this={tagInput}
                bind:value={tag}
                label={localize('general.tag')}
                description={localize('tooltips.optionalInput')}
            />
        </optional-inputs>
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
