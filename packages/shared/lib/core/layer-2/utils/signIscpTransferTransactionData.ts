import { getNetwork } from '@core/network'
import { ContractType } from '@core/layer-2/enums'
import { IAsset } from '@core/wallet'
import { buildBip32Path, getSelectedAccount } from '@core/account'

import { ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'
import {
    evmAddressToAgentID,
    getAgentBalanceParameters,
    getCommonTransactionData,
    getLayer2Allowance,
    getSmartContractHexName,
    signTransactionWithLedger,
} from '.'

export async function signIscpTransferTransactionData(
    recipientAddress: string,
    asset: IAsset,
    amount: string
): Promise<string | undefined> {
    const chain = getNetwork()?.getChain(asset.chainId)
    if (!chain) {
        return Promise.reject('No chain configured.')
    }
    const provider = chain.getProvider()
    const evmAddress = getSelectedAccount()?.evmAddresses?.[chain.getConfiguration().coinType]

    if (!evmAddress) {
        return Promise.reject('No EVM address.')
    }
    if (!provider) {
        return Promise.reject('Unable to find web3 provider.')
    }

    const accountsCoreContract = getSmartContractHexName('accounts')
    const transferAllowanceTo = getSmartContractHexName('transferAllowanceTo')

    const agentId = evmAddressToAgentID(recipientAddress)
    const parameters = getAgentBalanceParameters(agentId)
    const allowance = getLayer2Allowance(asset, amount)

    const contract = chain.getContract(ContractType.IscMagic, ISC_MAGIC_CONTRACT_ADDRESS)
    const data = await contract.methods
        .call(accountsCoreContract, transferAllowanceTo, parameters, allowance)
        .encodeABI()

    const transaction = await getCommonTransactionData(provider, evmAddress, data)
    // Sets smart contract call data for transferAllowanceTos
    transaction.data = data

    const bip32 = buildBip32Path(60, 0)
    return signTransactionWithLedger(transaction, bip32)
}
