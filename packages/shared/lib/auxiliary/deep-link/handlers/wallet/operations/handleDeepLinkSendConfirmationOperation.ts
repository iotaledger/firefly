import { PopupId, openPopup } from '@auxiliary/popup'
import { getByteLengthOfString, isStringTrue, isValidBech32AddressAndPrefix, validateAssetId } from '@core/utils'
import {
    NewTransactionDetails,
    NewTransactionType,
    Subject,
    SubjectType,
    getAssetById,
    getUnitFromTokenMetadata,
    selectedAccountAssets,
    setNewTransactionDetails,
} from '@core/wallet'
import { get } from 'svelte/store'
import { SendOperationParameter } from '../../../enums'
import {
    InvalidAddressError,
    MetadataLengthError,
    NoAddressSpecifiedError,
    SurplusNotANumberError,
    SurplusNotSupportedError,
    TagLengthError,
    UnknownAssetError,
} from '../../../errors'
import { getRawAmountFromSearchParam } from '../../../utils'
import { getNetworkHrp } from '@core/profile/actions'
import { getActiveNetworkId } from '@core/network/utils/getNetworkId'

export function handleDeepLinkSendConfirmationOperation(searchParams: URLSearchParams): void {
    const transactionDetails = parseSendConfirmationOperation(searchParams)

    if (transactionDetails) {
        setNewTransactionDetails(transactionDetails)
        openPopup({
            id: PopupId.SendConfirmation,
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
    if (!isValidBech32AddressAndPrefix(address, getNetworkHrp())) {
        throw new InvalidAddressError()
    }

    const recipient: Subject = { type: SubjectType.Address, address }

    const assetId = searchParams.get(SendOperationParameter.AssetId)
    assetId && validateAssetId(assetId)

    const networkId = getActiveNetworkId()
    const baseAsset = networkId ? get(selectedAccountAssets)[networkId].baseCoin : undefined
    const asset = assetId && networkId ? getAssetById(assetId, networkId) : baseAsset
    if (!asset) {
        throw new UnknownAssetError()
    }

    const rawAmount = getRawAmountFromSearchParam(searchParams)

    const surplus = searchParams.get(SendOperationParameter.Surplus)
    if (surplus && parseInt(surplus).toString() !== surplus) {
        throw new SurplusNotANumberError(surplus)
    } else if (surplus && asset.id === baseAsset.id) {
        throw new SurplusNotSupportedError()
    }

    const metadata = searchParams.get(SendOperationParameter.Metadata)
    if (metadata && getByteLengthOfString(metadata) > 8192) {
        throw new MetadataLengthError()
    }

    const tag = searchParams.get(SendOperationParameter.Tag)
    if (tag && getByteLengthOfString(tag) > 64) {
        throw new TagLengthError()
    }

    const unit = searchParams.get(SendOperationParameter.Unit) ?? getUnitFromTokenMetadata(asset.metadata)
    const giftStorageDeposit = isStringTrue(searchParams.get(SendOperationParameter.GiftStorageDeposit))
    const disableToggleGift = isStringTrue(searchParams.get(SendOperationParameter.DisableToggleGift))
    const disableChangeExpiration = isStringTrue(searchParams.get(SendOperationParameter.DisableChangeExpiration))

    return {
        type: NewTransactionType.TokenTransfer,
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
