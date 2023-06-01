import { get } from 'svelte/store'

import { network } from '@core/network'

import { ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'
import { ContractType } from '@core/layer-2/enums'
import { evmAddressToAgentID, getAgentBalanceParameters, getSmartContractHexName } from '@core/layer-2/utils'
import { IAsset } from '@core/wallet'

export async function prepareIrc30EvmTransactionData(
    recipientAddress: string,
    asset: IAsset
    // amount: number,
): Promise<void> {
    // assert(asset.chainId !== ChainId.Layer1)

    const chain = get(network)?.getChain(asset.chainId)
    if (chain) {
        const accountsCoreContract = getSmartContractHexName('accounts')
        const transferAllowanceTo = getSmartContractHexName('transferAllowanceTo')
        const agentId = evmAddressToAgentID(recipientAddress)
        const parameters = getAgentBalanceParameters(agentId)
        const allowance = {
            baseTokens: 0,
            nativeTokens: [],
            nfts: [],
        }

        // console.log('asset', asset)
        // if (true) {

        // } else {
        //     console.log('Native TOken')
        //     allowance = {
        //         baseTokens: 0,
        //         nativeTokens: [{
        //             ID: [asset.id],
        //             amount
        //         }],
        //         nfts: []
        //     }
        // }
        // const parameters = [{data: binaryAddress}, allowance]

        const contract = chain.getContract(ContractType.IscMagic, ISC_MAGIC_CONTRACT_ADDRESS)
        const transferResult = await contract.methods
            .call(accountsCoreContract, transferAllowanceTo, parameters, allowance)
            .encodeABI()
        console.warn('Transfer', transferResult)
    } else {
        throw new Error('Unable to find web3 provider.')
    }
}
