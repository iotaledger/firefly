import { selectedAccount } from '@core/account'
import { ContractType, evmAddressToAgentID, getAgentBalanceParameters, getSmartContractHexName } from '@core/layer-2'
import { IChain, network } from '@core/network'
import { get } from 'svelte/store'
import { ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'
import { getOrRequestAssetFromPersistedAssets } from '@core/wallet/actions'
import { addPersistedAsset } from '@core/wallet/stores'
import { Converter } from '@core/utils/convert'
import { TOKEN_ID_BYTE_LENGTH } from '@core/token/constants'
import { setL2BalancesForAccountForChain } from '../stores'

export async function fetchSelectedAccountLayer2Balance(): Promise<void> {
    const { evmAddresses, index } = get(selectedAccount) ?? {}
    const chains = get(network)?.getChains() ?? []
    const nativeTokensPromises = chains.map(async (chain) => {
        const { coinType, chainId } = chain.getConfiguration()
        const evmAddress = evmAddresses?.[coinType]
        if (evmAddress && index !== undefined) {
            const balances = await getSelectedAccountLayer2BalanceForAddress(evmAddress, chain)
            if (balances) {
                const l2Balance: { [tokenId: string]: number } = {}

                for (const { balance, tokenId } of balances) {
                    const idBytes = Converter.hexToBytes(tokenId)
                    if (idBytes.length === TOKEN_ID_BYTE_LENGTH) {
                        const asset = await getOrRequestAssetFromPersistedAssets(tokenId)
                        addPersistedAsset(asset)
                    }
                    l2Balance[tokenId] = balance
                }
                setL2BalancesForAccountForChain(index, chainId, l2Balance)
            } else {
                return Promise.resolve([])
            }
        }
    })
    try {
        await Promise.all(nativeTokensPromises)
    } catch (error) {
        return Promise.reject()
    }
}

async function getSelectedAccountLayer2BalanceForAddress(
    selectedAccountEvmAddress: string,
    chain: IChain
): Promise<{ balance: number; tokenId: string }[] | undefined> {
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
                const nativeToken = {
                    balance: Number(item.value),
                    tokenId: id,
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
