import { evmAddressToAgentID, getAgentBalanceParameters, getSmartContractHexName, ISC_SANDBOX_ABI } from '@core/layer-2'
import { network } from '@core/network'
import { TOKEN_ID_BYTE_LENGTH } from '@core/token'
import { Converter } from '@iota/util.js'
import { get } from 'svelte/store'
import { ISC_CONTRACT } from '../constants'
import { ILayer2NativeToken } from '../interfaces'

// TODO: remove this hardcoded address and use the account's EVM address instead
const HARDCODED_EVM_ADDRESS = 'WRITE_YOUR_EVM_ADDRESS_HERE'

export function getLayer2NativeTokens(): ILayer2NativeToken[] {
    const chains = get(network)?.getChains()
    const accountsCoreContract = getSmartContractHexName('accounts')
    const getBalanceFunc = getSmartContractHexName('balance')
    const agentID = evmAddressToAgentID(HARDCODED_EVM_ADDRESS)
    const parameters = getAgentBalanceParameters(agentID)
    const nativeTokens: ILayer2NativeToken[] = []
    chains?.forEach(async (chain) => {
        try {
            const provider = chain.getProvider()
            const contract = new provider.eth.Contract(ISC_SANDBOX_ABI, ISC_CONTRACT)
            const nativeTokenResult = await contract.methods
                .callView(accountsCoreContract, getBalanceFunc, parameters)
                .call()

            for (const item of nativeTokenResult.items) {
                const id = item.key
                const idBytes = Converter.hexToBytes(id)

                if (idBytes.length !== TOKEN_ID_BYTE_LENGTH) {
                    continue
                }

                const nativeToken = {
                    amount: BigInt(item.value),
                    id: id,
                }

                nativeTokens.push(nativeToken)
            }
        } catch (e) {
            console.error(e)
        }
    })
    return nativeTokens
}
