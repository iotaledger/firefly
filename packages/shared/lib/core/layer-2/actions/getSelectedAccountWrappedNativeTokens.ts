import { selectedAccount } from '@core/account/stores'
import { evmAddressToAgentID, getAgentBalanceParameters, getSmartContractHexName } from '@core/layer-2/utils'
import { ContractType } from '@core/layer-2/enums'
import { network } from '@core/network'
import { TOKEN_ID_BYTE_LENGTH } from '@core/token'
import { Converter } from '@iota/util.js'
import { get } from 'svelte/store'
import { ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'

export async function getSelectedAccountWrappedNativeTokens(): Promise<{ amount: bigint; id: string }[]> {
    const selectedAccountEvmAddresses = get(selectedAccount)?.evmAddresses
    const evmAddresses = selectedAccountEvmAddresses ? Object.values(selectedAccountEvmAddresses) : []
    const wrappedNativeTokens = []
    for (const evmAddress of evmAddresses) {
        if (evmAddress) {
            const nativeTokens = await getSelectedAccountWrappedNativeTokensForAddress(evmAddress)
            if (nativeTokens) {
                wrappedNativeTokens.push(...nativeTokens)
            }
        }
    }
    return wrappedNativeTokens
}

async function getSelectedAccountWrappedNativeTokensForAddress(
    selectedAccountEvmAddress: string
): Promise<{ amount: bigint; id: string }[] | undefined> {
    try {
        // TODO: validate evmAddress with validateEthereumAddress when the app errors are removed from it
        const chains = get(network)?.getChains()
        const accountsCoreContract = getSmartContractHexName('accounts')
        const getBalanceFunc = getSmartContractHexName('balance')
        const agentID = evmAddressToAgentID(selectedAccountEvmAddress)
        const parameters = getAgentBalanceParameters(agentID)
        const nativeTokensPromises = chains?.map(async (chain) => {
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
        })
        const nativeTokens = await Promise.all(nativeTokensPromises)
        return nativeTokens?.flat()
    } catch (err) {
        const error = err?.message ?? err
        console.error(error)
    }
}
