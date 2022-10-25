import { get } from 'svelte/store'

import { networkHrp } from '@core/network'
import { isStringTrue, getByteLengthOfString } from '@core/utils'
import {
    getAssetById,
    NewTransactionDetails,
    selectedAccountAssets,
    setNewTransactionDetails,
    Subject,
} from '@core/wallet'
import { isValidAddressAndPrefix } from '@lib/address'
import { openPopup } from '@auxiliary/popup'

import { SendOperationParameter } from '../../../enums'
import {
    SurplusNotANumberError,
    InvalidAddressError,
    MetadataLengthError,
    NoAddressSpecifiedError,
    TagLengthError,
    UnknownAssetError,
} from '../../../errors'
import { getRawAmountFromSearchParam } from '../../../utils'

export function handleDeepLinkSendConfirmationOperation(searchParams: URLSearchParams): void {
    const transactionDetails = parseSendConfirmationOperation(searchParams)

    if (transactionDetails) {
        setNewTransactionDetails(transactionDetails)
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
 * @return {NewTransactionDetails} The formatted parameters for the send operation.
 */
function parseSendConfirmationOperation(searchParams: URLSearchParams): NewTransactionDetails {
    // Check address exists and is valid this is not optional.
    const address = searchParams.get(SendOperationParameter.Address)
    if (!address) {
        throw new NoAddressSpecifiedError()
    }
    if (!isValidAddressAndPrefix(address, get(networkHrp))) {
        throw new InvalidAddressError()
    }

    const recipient: Subject = { type: 'address', address }

    const assetId = searchParams.get(SendOperationParameter.AssetId)
    const baseAsset = get(selectedAccountAssets).baseCoin
    const asset = assetId ? getAssetById(assetId) : baseAsset
    if (!asset) {
        throw new UnknownAssetError()
    }

    const rawAmount = getRawAmountFromSearchParam(searchParams)

    const surplus = searchParams.get(SendOperationParameter.Surplus)
    if (surplus && parseInt(surplus).toString() !== surplus) {
        throw new SurplusNotANumberError(surplus)
    }

    const metadata = searchParams.get(SendOperationParameter.Metadata)
    if (getByteLengthOfString(metadata) > 8192) {
        throw new MetadataLengthError()
    }

    const tag = searchParams.get(SendOperationParameter.Tag)
    if (getByteLengthOfString(tag) > 64) {
        throw new TagLengthError()
    }

    const unit = searchParams.get(SendOperationParameter.Unit) ?? asset.metadata?.unit
    const giftStorageDeposit = isStringTrue(searchParams.get(SendOperationParameter.GiftStorageDeposit))
    const disableToggleGift = isStringTrue(searchParams.get(SendOperationParameter.DisableToggleGift))
    const disableChangeExpiration = isStringTrue(searchParams.get(SendOperationParameter.DisableChangeExpiration))

    return {
        type: 'newToken',
        ...(asset && { asset }),
        ...(recipient && { recipient }),
        ...(rawAmount && { rawAmount }),
        ...(unit && { unit }),
        ...(metadata && { metadata }),
        ...(tag && { tag }),
        ...(giftStorageDeposit && { giftStorageDeposit }),
        ...(surplus && { surplus }),
        ...(disableToggleGift && { disableToggleGift }),
        ...(disableChangeExpiration && { disableChangeExpiration }),
    }
}
