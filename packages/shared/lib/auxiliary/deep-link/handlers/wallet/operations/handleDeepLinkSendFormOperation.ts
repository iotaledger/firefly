import {
    NewTransactionDetails,
    Subject,
    setNewTransactionDetails,
    selectedAccountAssets,
    getAssetById,
    NewTransactionType,
    getUnitFromTokenMetadata,
} from '@core/wallet'
import { openOverlay, PopupId } from '@overlay'
import { get } from 'svelte/store'

import { SendOperationParameter } from '../../../enums'
import { UnknownAssetError } from '../../../errors'
import { getRawAmountFromSearchParam } from '../../../utils'

export function handleDeepLinkSendFormOperation(searchParams: URLSearchParams): void {
    const transactionDetails = parseSendFormOperation(searchParams)

    if (transactionDetails) {
        setNewTransactionDetails(transactionDetails)
        openOverlay({
            id: PopupId.SendForm,
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
 * @return {NewTransactionDetails} The formatted parameters for the send operation.
 */
function parseSendFormOperation(searchParams: URLSearchParams): NewTransactionDetails {
    const assetId = searchParams.get(SendOperationParameter.AssetId)
    const asset = assetId ? getAssetById(assetId) : get(selectedAccountAssets).baseCoin
    if (!asset) {
        throw new UnknownAssetError()
    }

    const address = searchParams.get(SendOperationParameter.Address)
    const unit = searchParams.get(SendOperationParameter.Unit) ?? getUnitFromTokenMetadata(asset?.metadata)
    const rawAmount = getRawAmountFromSearchParam(searchParams)
    const metadata = searchParams.get(SendOperationParameter.Metadata)
    const tag = searchParams.get(SendOperationParameter.Tag)
    const recipient: Subject = address ? { type: 'address', address } : undefined

    return {
        type: NewTransactionType.TokenTransfer,
        ...(assetId && { assetId }),
        ...(recipient && { recipient }),
        ...(rawAmount && { rawAmount }),
        ...(unit && { unit }),
        ...(metadata && { metadata }),
        ...(tag && { tag }),
    }
}
