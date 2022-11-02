<script lang="typescript">
    import { get } from 'svelte/store'
    import { localize } from '@core/i18n'
    import {
        ActivityType,
        newNftTransactionDetails,
        selectedAccountActivities,
        updateNewNftTransactionDetails,
    } from '@core/wallet'
    import {
        Button,
        Text,
        RecipientInput,
        NftInput,
        NftMediaSize,
        NftMediaContainer,
        FontWeight,
    } from 'shared/components'
    import { closePopup, openPopup } from '@auxiliary/popup'
    import type { FeatureTypes } from '@iota/types'

    let { nftId, recipient } = get(newNftTransactionDetails)
    let recipientInput: RecipientInput

    async function onSend(): Promise<void> {
        const valid = await validate()
        if (valid) {
            updateNewNftTransactionDetails({ nftId, recipient, immutableFeatures: getNftImmutableFeatures() })
            openPopup({
                type: 'sendNftConfirmation',
                overflow: true,
            })
        }
    }

    async function validate(): Promise<boolean> {
        try {
            await recipientInput?.validate()
            return true
        } catch (error) {
            console.error('Error: ', error)
            return false
        }
    }

    function getNftImmutableFeatures(): FeatureTypes[] {
        const nftActivity = $selectedAccountActivities.find(
            (activity) => activity.data.type === ActivityType.Nft && activity.data.nftId === nftId
        )
        return nftActivity?.data.type === ActivityType.Nft ? nftActivity.data.immutableFeatures : []
    }

    function onCancel(): void {
        closePopup()
    }
</script>

<send-form-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type="h3" fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.sendNft.formTitle')}
    </Text>
    <NftMediaContainer {nftId} size={NftMediaSize.Medium} />
    <send-form-inputs class="flex flex-col space-y-4">
        <NftInput bind:nftId />
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
