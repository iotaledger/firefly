import { encodeAddress, encodeAssetAllowance, encodeSmartContractParameters } from '../helpers'
import BigInteger from 'big-integer'
import type { NewTransactionDetails } from '@core/wallet/types'
import { getAddressFromSubject } from '@core/wallet/utils'
import { SpecialStream } from '../classes'
import { ACCOUNTS_CONTRACT, EXTERNALLY_OWNED_ACCOUNT, GAS_BUDGET, TRANSFER_ALLOWANCE } from '../constants'
import { getEstimatedGasForTransferFromTransactionDetails } from './getEstimatedGasForTransferFromTransactionDetails'
// import { getActiveNetworkId } from '@core/network/utils/getNetworkId'
// import { NetworkId } from '@core/network'
// import { Converter } from '@iota/util.js'

export async function getLayer2MetadataForTransfer(transactionDetails: NewTransactionDetails): Promise<string> {
    const metadataStream = new SpecialStream()

    const address = getAddressFromSubject(transactionDetails.recipient)
    const encodedAddress = encodeAddress(address.toLowerCase())

    const estimatedGas = await getEstimatedGasForTransferFromTransactionDetails()
    // if (getActiveNetworkId() === NetworkId.Shimmer) {
    metadataStream.writeUInt8('senderContract', EXTERNALLY_OWNED_ACCOUNT)

    // } else {
    //     metadataStream.writeUInt32('senderContract', EXTERNALLY_OWNED_ACCOUNT)
    // }
    metadataStream.writeUInt32('targetContract', ACCOUNTS_CONTRACT)
    metadataStream.writeUInt32('contractFunction', TRANSFER_ALLOWANCE)
    metadataStream.writeUInt64SpecialEncoding('gasBudget', BigInteger(estimatedGas) ?? GAS_BUDGET)

    const smartContractParameters = Object.entries({ a: encodedAddress })
    const parameters = encodeSmartContractParameters(smartContractParameters)
    metadataStream.writeBytes('smartContractParameters', parameters.length, parameters)

    const allowance = encodeAssetAllowance(transactionDetails)
    metadataStream.writeBytes('allowance', allowance.length, allowance)

    return '0x' + metadataStream.finalHex()
}
