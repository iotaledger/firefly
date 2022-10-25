<script lang="typescript">
    import { get } from 'svelte/store'
    import {
        ActivityType,
        newTransactionDetails,
        selectedAccountActivities,
        Subject,
        updateNewTransactionDetails,
    } from '@core/wallet'
    import { RecipientInput, NftInput } from 'shared/components'
    import type { FeatureTypes } from '@iota/types'

    let recipientInput: RecipientInput
    let nftId: string
    let recipient: Subject

    const transactionDetail = get(newTransactionDetails)
    if (transactionDetail.type === 'newNft') {
        nftId = transactionDetail.nftId
        recipient = transactionDetail.recipient
    }

    export async function handleFormSubmit(): Promise<boolean> {
        const valid = await validate()
        if (valid) {
            updateNewTransactionDetails({ nftId, recipient, immutableFeatures: getNftImmutableFeatures() })
        }
        return valid
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
</script>

<NftInput bind:nftId />
<RecipientInput bind:this={recipientInput} bind:recipient />
