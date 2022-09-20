import { get } from 'svelte/store'
import { networkHrp } from '@core/network'
import {
    getAssetById,
    INewTransactionDetails,
    selectedAccountAssets,
    Subject,
    updateNewTransactionDetails,
} from '@core/wallet'
import { isValidAddressAndPrefix } from '@lib/address'
import { openPopup } from '@lib/popup'

import { SendOperationParameter } from '../../../enums'
import {
    InvalidAddressError,
    MetadataLengthError,
    NoAddressSpecifiedError,
    TagLengthError,
    UnknownAssetError,
} from '../../../errors'
import { getAmountFromSearchParam } from '../../../utils'
import { getByteLengthOfString } from '@lib/utils/getByteLengthOfString'
import { isStringTrue } from '@core/utils'

export function handleDeepLinkSendConfirmationOperation(searchParams: URLSearchParams): void {
    const transactionDetails = parseSendConfirmationOperation(searchParams)

    if (transactionDetails) {
        updateNewTransactionDetails({ ...transactionDetails })
        openPopup({
            type: 'sendConfirmation',
            overflow: true,
            props: {
                disableBack: true,
            },
        })
    }
}

/**
 * Parses a deep link for the send operation.
 *
 * @method parseSendConfirmationOperation
 *
 * @param {URLSearchParams} searchParams The query parameters of the deep link URL.
 *
 * @return {INewTransactionDetails} The formatted parameters for the send operation.
 */
function parseSendConfirmationOperation(searchParams: URLSearchParams): INewTransactionDetails {
    // Check address exists and is valid this is not optional.
    const address = searchParams.get(SendOperationParameter.Address)
    if (!address) {
        throw new NoAddressSpecifiedError()
    }
    if (!isValidAddressAndPrefix(address, get(networkHrp))) {
        throw new InvalidAddressError()
    }

    const metadata = searchParams.get(SendOperationParameter.Metadata)
    if (getByteLengthOfString(metadata) > 8192) {
        throw new MetadataLengthError()
    }

    const tag = searchParams.get(SendOperationParameter.Tag)
    if (getByteLengthOfString(tag) > 64) {
        throw new TagLengthError()
    }
    const assetId = searchParams.get(SendOperationParameter.AssetId)
    const asset = assetId ? getAssetById(assetId) : get(selectedAccountAssets).baseCoin
    if (!asset) {
        throw new UnknownAssetError()
    }

    const unit = searchParams.get(SendOperationParameter.Unit) ?? asset.metadata?.unit
    const amount = getAmountFromSearchParam(searchParams, asset?.metadata)
    const recipient: Subject = { type: 'address', address }
    const giftStorageDeposit = isStringTrue(searchParams.get(SendOperationParameter.GiftStorageDeposit))
    const disableToggleGift = isStringTrue(searchParams.get(SendOperationParameter.DisableToggleGift))
    const disableChangeExpiration = isStringTrue(searchParams.get(SendOperationParameter.DisableChangeExpiration))

    return {
        ...(asset && { asset }),
        ...(recipient && { recipient }),
        ...(amount && { amount }),
        ...(unit && { unit }),
        ...(metadata && { metadata }),
        ...(tag && { tag }),
        ...(giftStorageDeposit && { giftStorageDeposit }),
        ...(disableToggleGift && { disableToggleGift }),
        ...(disableChangeExpiration && { disableChangeExpiration }),
    }
}
