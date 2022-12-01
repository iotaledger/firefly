<script lang="typescript">
    import { closePopup, openPopup } from '@auxiliary/popup'
    import { localize } from '@core/i18n'
    import { isLayer1Destination } from '@core/layer-2'
    import { selectedAccountNfts } from '@core/nfts'
    import { getByteLengthOfString, MAX_METADATA_BYTES, MAX_TAG_BYTES } from '@core/utils'
    import {
        getAssetById,
        IAsset,
        newTransactionDetails,
        NewTransactionType,
        setNewTransactionDetails,
    } from '@core/wallet'
    import {
        AssetAmountInput,
        Button,
        FontWeight,
        NetworkInput,
        NftInput,
        OptionalInput,
        RecipientInput,
        Tabs,
        Text,
        TextType,
    } from 'shared/components'
    import { get } from 'svelte/store'

    enum SendForm {
        SendToken = 'general.sendToken',
        SendNft = 'general.sendNft',
    }

    const transactionDetails = get(newTransactionDetails)
    let { metadata, recipient, tag, layer2Parameters } = transactionDetails

    let assetAmountInput: AssetAmountInput
    let nftInput: NftInput
    let networkInput: NetworkInput
    let recipientInput: RecipientInput
    let metadataInput: OptionalInput
    let tagInput: OptionalInput

    let networkAddress = layer2Parameters?.networkAddress

    let nftId: string
    let rawAmount: string
    let asset: IAsset
    let unit: string

    if (transactionDetails.type === NewTransactionType.TokenTransfer) {
        rawAmount = transactionDetails.rawAmount
        asset = getAssetById(transactionDetails.assetId)
        unit = transactionDetails.unit
    } else {
        nftId = transactionDetails.nftId
    }

    const tabs: SendForm[] = [SendForm.SendToken, SendForm.SendNft]
    let activeTab: SendForm =
        transactionDetails.type === NewTransactionType.TokenTransfer ? SendForm.SendToken : SendForm.SendNft

    $: ownsNfts = $selectedAccountNfts.some((nft) => nft.isSpendable)
    $: isLayer2 = !isLayer1Destination(networkAddress)
    $: isSendTokenTab = activeTab === SendForm.SendToken

    function setTransactionDetails(): void {
        layer2Parameters = isLayer2 ? { networkAddress } : null

        if (isSendTokenTab) {
            setNewTransactionDetails({
                type: NewTransactionType.TokenTransfer,
                recipient,
                assetId: asset.id,
                rawAmount,
                unit,
                tag,
                metadata,
                layer2Parameters,
            })
        } else {
            setNewTransactionDetails({
                type: NewTransactionType.NftTransfer,
                recipient,
                nftId,
                tag,
                metadata,
            })
        }
    }

    async function validate(): Promise<boolean> {
        try {
            await Promise.all([
                isSendTokenTab ? assetAmountInput?.validate() : nftInput?.validate(),
                recipientInput?.validate(),
                networkInput?.validate(),
                metadataInput?.validate(
                    validateOptionalInput(metadata, MAX_METADATA_BYTES, localize('error.send.metadataTooLong'))
                ),
                tagInput?.validate(validateOptionalInput(tag, MAX_TAG_BYTES, localize('error.send.tagTooLong'))),
            ])
            return true
        } catch (err) {
            console.error('Error: ', err)
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
            setTransactionDetails()
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
        {localize('popups.transaction.title')}
    </Text>
    <send-form-inputs class="flex flex-col space-y-4">
        {#if ownsNfts}
            <Tabs bind:activeTab {tabs} />
        {/if}
        {#if activeTab === SendForm.SendToken}
            <AssetAmountInput bind:this={assetAmountInput} bind:asset bind:rawAmount bind:unit />
        {:else}
            <NftInput bind:this={nftInput} bind:nftId />
        {/if}
        <NetworkInput bind:this={networkInput} bind:networkAddress showLayer2={isSendTokenTab} />
        <RecipientInput bind:this={recipientInput} bind:recipient {isLayer2} />
        <optional-inputs class="flex flex-row flex-wrap gap-4">
            <OptionalInput
                bind:this={tagInput}
                bind:value={tag}
                label={localize('general.tag')}
                description={localize('tooltips.optionalInput')}
            />
            {#if !isLayer2}
                <OptionalInput
                    bind:this={metadataInput}
                    bind:value={metadata}
                    label={localize('general.metadata')}
                    description={localize('tooltips.optionalInput')}
                />
            {/if}
        </optional-inputs>
    </send-form-inputs>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onCancel}>
            {localize('actions.cancel')}
        </Button>
        <Button classes="w-full" onClick={onContinue}>
            {localize('actions.next')}
        </Button>
    </popup-buttons>
</send-form-popup>
