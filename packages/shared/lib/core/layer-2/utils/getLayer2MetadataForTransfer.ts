import { encodeAddress, encodeAssetAllowance, encodeSmartContractParameters } from '../helpers'

import { WriteStream } from '@iota/util.js'
import { getAddressFromSubject } from '@core/wallet/utils'
import type { NewTransactionDetails } from '@core/wallet/types'
import { ACCOUNTS_CONTRACT, EXTERNALLY_OWNED_ACCOUNT, GAS_BUDGET, TRANSFER_ALLOWANCE } from '../constants'
import BigInteger from 'big-integer'
import { getEstimatedGasForTransferFromTransactionDetails } from './getEstimatedGasForTransferFromTransactionDetails'

export async function getLayer2MetadataForTransfer(transactionDetails: NewTransactionDetails): Promise<string> {
    const metadataStream = new WriteStream()

    const address = getAddressFromSubject(transactionDetails.recipient)
    const encodedAddress = encodeAddress(address.toLowerCase())

    const estimatedGas = await getEstimatedGasForTransferFromTransactionDetails()

    metadataStream.writeUInt32('senderContract', EXTERNALLY_OWNED_ACCOUNT)
    metadataStream.writeUInt32('targetContract', ACCOUNTS_CONTRACT)
    metadataStream.writeUInt32('contractFunction', TRANSFER_ALLOWANCE)
    metadataStream.writeUInt64('gasBudget', BigInteger(estimatedGas) ?? GAS_BUDGET)

    const smartContractParameters = Object.entries({ a: encodedAddress })
    const parameters = encodeSmartContractParameters(smartContractParameters)
    metadataStream.writeBytes('smartContractParameters', parameters.length, parameters)

    const allowance = encodeAssetAllowance(transactionDetails)
    metadataStream.writeBytes('allowance', allowance.length, allowance)

    return '0x' + metadataStream.finalHex()
}
