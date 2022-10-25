<script lang="typescript">
    import { get } from 'svelte/store'
    import { localize } from '@core/i18n'
    import { IAsset, newTransactionDetails, Subject, updateNewTransactionDetails } from '@core/wallet'
    import { RecipientInput, AssetAmountInput, OptionalInput, NetworkInput } from 'shared/components'
    import { getByteLengthOfString } from '@core/utils'
    import type { DestinationNetwork } from '@core/network'

    let assetAmountInput: AssetAmountInput
    let recipientInput: RecipientInput
    let metadataInput: OptionalInput
    let tagInput: OptionalInput

    let network: DestinationNetwork

    let rawAmount: string
    let asset: IAsset
    let metadata: string
    let recipient: Subject
    let tag: string
    let unit: string

    const transactionDetail = get(newTransactionDetails)
    if (transactionDetail.type === 'newToken') {
        rawAmount = transactionDetail.rawAmount
        asset = transactionDetail.asset
        metadata = transactionDetail.metadata
        recipient = transactionDetail.recipient
        tag = transactionDetail.tag
        unit = transactionDetail.unit
    }

    export async function handleFormSubmit(): Promise<boolean> {
        const valid = await validate()
        if (valid) {
            updateNewTransactionDetails({ asset, rawAmount, unit, recipient, metadata, tag })
        }
        return valid
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
</script>

<AssetAmountInput bind:this={assetAmountInput} bind:asset bind:rawAmount bind:unit />
<NetworkInput bind:network />
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
