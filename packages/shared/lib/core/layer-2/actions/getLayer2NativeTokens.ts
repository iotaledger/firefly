import { evmAddressToAgentID, getAgentBalanceParameters, getSmartContractHexName, ISC_SANDBOX_ABI } from '@core/layer-2'
import { network } from '@core/network'
import { TOKEN_ID_BYTE_LENGTH } from '@core/token'
import { Converter } from '@iota/util.js'
import { get } from 'svelte/store'
import { ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'

// TODO: remove this hardcoded address and use the account's EVM address instead
const HARDCODED_EVM_ADDRESS = 'WRITE_YOUR_EVM_ADDRESS_HERE'

// TODO: missing set native tokens, which converts the function to getAndSetLayer2NativeTokens
export async function getLayer2NativeTokens(): Promise<{ amount: bigint; id: string }[]> {
    const chains = get(network)?.getChains()
    const accountsCoreContract = getSmartContractHexName('accounts')
    const getBalanceFunc = getSmartContractHexName('balance')
    const agentID = evmAddressToAgentID(HARDCODED_EVM_ADDRESS)
    const parameters = getAgentBalanceParameters(agentID)
    const nativeTokensPromises = chains?.map(async (chain) => {
        try {
            const provider = chain.getProvider()
            const contract = new provider.eth.Contract(ISC_SANDBOX_ABI, ISC_MAGIC_CONTRACT_ADDRESS)
            const nativeTokenResult = await contract.methods
                .callView(accountsCoreContract, getBalanceFunc, parameters)
                .call()

            const nativeTokens = []

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

            return nativeTokens
        } catch (e) {
            return []
        }
    })
    const nativeTokens = await Promise.all(nativeTokensPromises)
    return nativeTokens?.flat()
}
