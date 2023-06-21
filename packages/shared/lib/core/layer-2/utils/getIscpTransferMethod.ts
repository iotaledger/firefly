import { ContractType } from '@core/layer-2/enums'
import { getNetwork } from '@core/network'
import { IAsset } from '@core/wallet'

import { evmAddressToAgentID, getAgentBalanceParameters, getLayer2Allowance, getSmartContractHexName } from '.'
import { ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'

import { ContractSendMethod } from 'web3-eth-contract'

export function getIscpTransferMethod(
    recipientAddress: string,
    asset: IAsset,
    amount: string
): ContractSendMethod | undefined {
    try {
        const chain = getNetwork()?.getChain(asset.chainId)
        const provider = chain?.getProvider()
        const evmAddress = null

        if (chain && evmAddress && provider) {
            const accountsCoreContract = getSmartContractHexName('accounts')
            const transferAllowanceTo = getSmartContractHexName('transferAllowanceTo')

            const agentId = evmAddressToAgentID(recipientAddress)
            const parameters = getAgentBalanceParameters(agentId)
            const allowance = getLayer2Allowance(asset, amount)

            const contract = chain.getContract(ContractType.IscMagic, ISC_MAGIC_CONTRACT_ADDRESS)

            return contract.methods.call(accountsCoreContract, transferAllowanceTo, parameters, allowance)
        } else {
            throw new Error('Unable to find web3 provider.')
        }
    } catch (err) {
        console.error(err)
    }
}
