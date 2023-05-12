import { evmAddressToAgentID, getAgentBalanceParameters, getSmartContractHexName } from '@core/layer-2'
import { Converter } from '@iota/util.js'
import { get } from 'svelte/store'
import { ISC_SANDBOX_ABI } from '../abis/'
import { network } from '../stores'

const ISC_CONTRACT_ADDRESS = '0x1074000000000000000000000000000000000000'
const HARDCODED_EVM_ADDRESS = 'PUT_YOUR_EVM_ADDRESS_HERE'
const NativeTokenIDLength = 38

export function getAssetsOfChain(): void {
    const chains = get(network)?.getChains()
    const accountsCoreContract = getSmartContractHexName('accounts')
    const getBalanceFunc = getSmartContractHexName('balance')
    const agentID = evmAddressToAgentID(HARDCODED_EVM_ADDRESS)
    const parameters = getAgentBalanceParameters(agentID)
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    chains?.forEach(async (chain) => {
        const provider = chain.getProvider()
        const contract = new provider.eth.Contract(ISC_SANDBOX_ABI, ISC_CONTRACT_ADDRESS)
        const nativeTokenResult = await contract.methods
            .callView(accountsCoreContract, getBalanceFunc, parameters)
            .call()
        const nativeTokens = []

        for (const item of nativeTokenResult.items) {
            const id = item.key
            const idBytes = Converter.hexToBytes(id)

            if (idBytes.length !== NativeTokenIDLength) {
                continue
            }

            const nativeToken = {
                // TODO: BigInt is required for native tokens, but it causes problems with the range slider. This needs to be adressed before shipping.
                amount: BigInt(item.value),
                id: id,
                // metadata: await getNativeTokenMetaData(nodeClient, indexerClient, id),
            }

            nativeTokens.push(nativeToken)
        }
    })
}
