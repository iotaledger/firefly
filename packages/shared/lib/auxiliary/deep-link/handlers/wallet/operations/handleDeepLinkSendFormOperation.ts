import {
    INewTransactionDetails,
    Subject,
    setNewTransactionDetails,
    selectedAccountAssets,
    getAssetById,
} from '@core/wallet'
import { openPopup } from '@lib/popup'
import { get } from 'svelte/store'

import { SendOperationParameter } from '../../../enums'
import { UnknownAssetError } from '../../../errors'
import { getRawAmountFromSearchParam } from '../../../utils'

export function handleDeepLinkSendFormOperation(searchParams: URLSearchParams): void {
    const transactionDetails = parseSendFormOperation(searchParams)

    if (transactionDetails) {
        setNewTransactionDetails(transactionDetails)
        openPopup({
            type: 'sendForm',
            overflow: true,
        })
    }
}

/**
 * Parses a deep link for the send form operation.
 *
 * @method parseSendFormOperation
 *
 * @param {URLSearchParams} searchParams The query parameters of the deep link URL.
 *
 * @return {INewTransactionDetails} The formatted parameters for the send operation.
 */
function parseSendFormOperation(searchParams: URLSearchParams): INewTransactionDetails {
    const assetId = searchParams.get(SendOperationParameter.AssetId)
    const asset = assetId ? getAssetById(assetId) : get(selectedAccountAssets).baseCoin
    if (!asset) {
        throw new UnknownAssetError()
    }

    const address = searchParams.get(SendOperationParameter.Address)
    const unit = searchParams.get(SendOperationParameter.Unit) ?? asset.metadata?.unit
    const rawAmount = getRawAmountFromSearchParam(searchParams)
    const metadata = searchParams.get(SendOperationParameter.Metadata)
    const tag = searchParams.get(SendOperationParameter.Tag)
    const recipient: Subject = address ? { type: 'address', address } : undefined

    return {
        ...(asset && { asset }),
        ...(recipient && { recipient }),
        ...(rawAmount && { rawAmount }),
        ...(unit && { unit }),
        ...(metadata && { metadata }),
        ...(tag && { tag }),
    }
}
