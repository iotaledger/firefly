import { selectedAccount } from '@core/account'
import { ContractType, evmAddressToAgentID, getAgentBalanceParameters, getSmartContractHexName } from '@core/layer-2'
import { IChain, network } from '@core/network'
import { TOKEN_ID_BYTE_LENGTH } from '@core/token'
import { Converter } from '@iota/util.js'
import { get } from 'svelte/store'
import { ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'

export async function getSelectedAccountWrappedNativeTokens(): Promise<{ amount: bigint; id: string }[]> {
    const selectedAccountEvmAddresses = get(selectedAccount)?.evmAddresses
    const chains = get(network)?.getChains() ?? []
    const nativeTokensPromises = chains.map(async (chain) => {
        const evmAddress =
            selectedAccountEvmAddresses?.[chain.getConfiguration().chainId] ??
            '0xA88107749C850Df5A4BbbD2197889dF90103dd06'
        if (evmAddress) {
            const nativeTokens = await getSelectedAccountWrappedNativeTokensForAddress(evmAddress, chain)
            if (nativeTokens) {
                return Promise.resolve(nativeTokens)
            } else {
                return Promise.resolve([])
            }
        }
    })
    try {
        const nativeTokens = await Promise.all(nativeTokensPromises)
        const filteredTokens = nativeTokens?.flat().filter((tokens) => !!tokens) as { amount: bigint; id: string }[]
        return filteredTokens
    } catch (error) {
        return []
    }
}

async function getSelectedAccountWrappedNativeTokensForAddress(
    selectedAccountEvmAddress: string,
    chain: IChain
): Promise<{ amount: bigint; id: string }[] | undefined> {
    try {
        // TODO: validate evmAddress with validateEthereumAddress when the app errors are removed from it
        const accountsCoreContract = getSmartContractHexName('accounts')
        const getBalanceFunc = getSmartContractHexName('balance')
        const agentID = evmAddressToAgentID(selectedAccountEvmAddress)
        const parameters = getAgentBalanceParameters(agentID)
        try {
            const contract = chain.getContract(ContractType.IscMagic, ISC_MAGIC_CONTRACT_ADDRESS)
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
    } catch (err) {
        const error = err?.message ?? err
        console.error(error)
    }
}
