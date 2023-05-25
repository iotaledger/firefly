import { evmAddressToAgentID, getAgentBalanceParameters, getSmartContractHexName } from '@core/layer-2/utils'
import { network } from '@core/network/stores'
import { IBaseToken } from '@core/wallet/interfaces'
import { get } from 'svelte/store'
import { ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'
import { ContractType } from '../enums'

export async function getSelectedAccountLayer2BaseTokens(): Promise<IBaseToken[]> {
    const chains = get(network)?.getChains()

    const baseTokensPromises = chains?.map(async (chain) => {
        try {
            const contract = chain.getContract(ContractType.IscMagic, ISC_MAGIC_CONTRACT_ADDRESS)
            const accountsCoreContract = getSmartContractHexName('accounts')
            const selectedAccountEvmAddress = '0x0375F368AD6bC48150dA5bFFe886409Aa60C5c9e'
            const agentID = evmAddressToAgentID(selectedAccountEvmAddress)
            const parameters = getAgentBalanceParameters(agentID)

            //
            const balanceBaseTokenFunction = getSmartContractHexName('balanceBaseToken')
            const balanceBaseTokens = await contract.methods
                .callView(accountsCoreContract, balanceBaseTokenFunction, parameters)
                .call()
            console.log('balanceBaseTokens', balanceBaseTokens)
            // - -

            //
            const balanceFunction = getSmartContractHexName('balance')
            const balance = await contract.methods
                .callView(accountsCoreContract, balanceFunction, parameters)
                .call()
            console.log('balance', balance)
            // - -

            return balanceBaseTokens
        } catch (e) {
            console.error(e)
            return []
        }
    })
    const baseTokens: IBaseToken[] = await Promise.all(baseTokensPromises)
    console.log('baseTokens')
    return baseTokens?.flat()
}
