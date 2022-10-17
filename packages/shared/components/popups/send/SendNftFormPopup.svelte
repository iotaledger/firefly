<script lang="typescript">
    import { get } from 'svelte/store'
    import { localize } from '@core/i18n'
    import { newNftTransactionDetails, updateNewNftTransactionDetails } from '@core/wallet'
    import { Button, Text, RecipientInput, NftInput, FontWeight } from 'shared/components'
    import { closePopup, openPopup } from '@lib/popup'

    let { nftId, recipient } = get(newNftTransactionDetails)
    let recipientInput: RecipientInput

    async function onSend(): Promise<void> {
        const valid = await validate()
        if (valid) {
            updateNewNftTransactionDetails({ nftId, recipient })
            openPopup({
                type: 'sendNftConfirmation',
                overflow: true,
            })
        }
    }

    async function validate(): Promise<boolean> {
        try {
            await Promise.all([recipientInput?.validate()])
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
        {localize('popups.sendNft.title')}
    </Text>
    <send-form-inputs class="flex flex-col space-y-4">
        <NftInput bind:nftId />
        <RecipientInput bind:this={recipientInput} bind:recipient />
        <optional-inputs class="flex flex-row flex-wrap gap-4">
            <!-- <OptionalInput
                bind:this={metadataInput}
                bind:value={metadata}
                label={localize('general.metadata')}
                description={localize('tooltips.optionalInput')}
            /> -->
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
