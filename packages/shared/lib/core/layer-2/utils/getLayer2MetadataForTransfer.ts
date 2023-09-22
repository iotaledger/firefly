import type { NewTransactionDetails } from '@core/wallet/types'
import { getAddressFromSubject } from '@core/wallet/utils'
import BigInteger from 'big-integer'
import { SpecialStream } from '../classes'
import { ACCOUNTS_CONTRACT, EXTERNALLY_OWNED_ACCOUNT, GAS_BUDGET, TRANSFER_ALLOWANCE } from '../constants'
import { encodeAddress, encodeAssetAllowance, encodeSmartContractParameters } from '../helpers'
import { getEstimatedGasForTransferFromTransactionDetails } from './getEstimatedGasForTransferFromTransactionDetails'
import { evmAddressToAgentID } from './'
// import { getActiveNetworkId } from '@core/network/utils/getNetworkId'
// import { NetworkId } from '@core/network'
// import { Converter } from '@iota/util.js'

export async function getLayer2MetadataForTransfer(transactionDetails: NewTransactionDetails): Promise<string> {
    const metadataStream = new SpecialStream()

    const address = getAddressFromSubject(transactionDetails.recipient)
    const encodedAddress = encodeAddress(address.toLowerCase())

    const estimatedGas = await getEstimatedGasForTransferFromTransactionDetails()

    metadataStream.writeUInt8('senderContract', EXTERNALLY_OWNED_ACCOUNT)
    metadataStream.writeUInt32('targetContract', ACCOUNTS_CONTRACT)
    metadataStream.writeUInt32('contractFunction', TRANSFER_ALLOWANCE)
    metadataStream.writeUInt64SpecialEncoding('gasBudget', BigInteger(estimatedGas) ?? GAS_BUDGET)

    const aliasAddress = 'rms1ppnkvsjctdg53v2x89uzhuxg89s073jmn2nuzcw44tggjy8rzzgzq2rg0qp'
    const evmAddressToAgentIdBuffer = evmAddressToAgentID(encodedAddress, aliasAddress)

    const smartContractParameters = Object.entries({ a: evmAddressToAgentIdBuffer })
    const parameters = encodeSmartContractParameters(smartContractParameters)
    metadataStream.writeBytes('smartContractParameters', parameters.length, parameters)

    const allowance = encodeAssetAllowance(transactionDetails)
    metadataStream.writeBytes('allowance', allowance.length, allowance)

    return '0x' + metadataStream.finalHex()
}
