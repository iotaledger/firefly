<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Button, Text, FontWeight, TextType, Tabs } from 'shared/components'
    import { closePopup, openPopup } from '@auxiliary/popup'
    import {
        IAsset,
        NewTransactionDetails,
        newTransactionDetails,
        NewTransactionType,
        setNewTransactionDetails,
    } from '@core/wallet'
    import {
        RecipientInput,
        AssetAmountInput,
        OptionalInput,
        NetworkInput,
        NftInput,
        NftMediaSize,
        NftMediaContainer,
    } from 'shared/components'
    import { DestinationNetwork } from '@core/network'
    import { getByteLengthOfString } from '@core/utils'
    import { get } from 'svelte/store'

    enum SendForm {
        SendToken = 'general.sendToken',
        SendNft = 'general.sendNft',
    }
    let assetAmountInput: AssetAmountInput
    let nftInput: NftInput
    let recipientInput: RecipientInput
    let metadataInput: OptionalInput
    let tagInput: OptionalInput

    let network: DestinationNetwork

    let nftId: string

    let rawAmount: string
    let asset: IAsset
    let unit: string

    const transactionDetails = get(newTransactionDetails)
    let { metadata, recipient, tag } = transactionDetails

    if (transactionDetails.type === NewTransactionType.TokenTransfer) {
        rawAmount = transactionDetails.rawAmount
        asset = transactionDetails.asset
        unit = transactionDetails.unit
    } else {
        nftId = transactionDetails.nftId
    }

    const tabs: SendForm[] = [SendForm.SendToken, SendForm.SendNft]
    let activeTab: SendForm =
        transactionDetails.type === NewTransactionType.TokenTransfer ? SendForm.SendToken : SendForm.SendNft

    function getTransactionDetails(): NewTransactionDetails {
        if (activeTab === SendForm.SendToken) {
            return {
                type: NewTransactionType.TokenTransfer,
                asset,
                rawAmount,
                unit,
                recipient,
                metadata,
                tag,
            }
        } else {
            return {
                type: NewTransactionType.NftTransfer,
                nftId,
                recipient,
                metadata,
                tag,
            }
        }
    }

    async function validate(): Promise<boolean> {
        try {
            await Promise.all([
                activeTab === SendForm.SendToken ? assetAmountInput?.validate() : nftInput?.validate(),
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

    function validateOptionalInput(value: string, byteLimit: number, errorMessage: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (getByteLengthOfString(value) > byteLimit) {
                reject(errorMessage)
            }
            resolve()
        })
    }

    async function onContinue(): Promise<void> {
        const valid = await validate()
        if (valid) {
            setNewTransactionDetails(getTransactionDetails())
            openPopup({
                type: 'sendConfirmation',
                overflow: true,
            })
        }
    }

    function onCancel(): void {
        closePopup()
    }
</script>

<send-form-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('general.sendAsset')}
    </Text>
    <Tabs bind:activeTab {tabs} />
    <send-form-inputs class="flex flex-col space-y-4">
        {#if activeTab === SendForm.SendToken}
            <AssetAmountInput bind:this={assetAmountInput} bind:asset bind:rawAmount bind:unit />
        {:else}
            <NftMediaContainer {nftId} size={NftMediaSize.Medium} />
            <NftInput bind:this={nftInput} bind:nftId />
        {/if}
        <NetworkInput bind:network />
        <RecipientInput bind:this={recipientInput} bind:recipient maxHeight="max-h-48" />
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
        <Button classes="w-full" onClick={onContinue}>
            {localize('actions.send')}
        </Button>
    </popup-buttons>
</send-form-popup>
