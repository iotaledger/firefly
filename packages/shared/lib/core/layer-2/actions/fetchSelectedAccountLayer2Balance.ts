import { ContractType, evmAddressToAgentID, getAgentBalanceParameters, getSmartContractHexName } from '@core/layer-2'
import { IChain, getNetwork } from '@core/network'
import { ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'
import { getOrRequestAssetFromPersistedAssets } from '@core/wallet/actions'
import { addPersistedAsset } from '@core/wallet/stores'
import { Converter } from '@core/utils/convert'
import { TOKEN_ID_BYTE_LENGTH } from '@core/token/constants'
import { setLayer2AccountBalanceForChain } from '../stores'
import { getSelectedAccount } from '@core/account/stores'

export function fetchSelectedAccountLayer2Balance(): void {
    const account = getSelectedAccount()
    if (!account) {
        return
    }

    const { evmAddresses, index } = account
    const chains = getNetwork()?.getChains() ?? []
    chains.forEach(async (chain) => {
        const { coinType, chainId } = chain.getConfiguration()
        const evmAddress = evmAddresses?.[coinType] // ?? '0xA88107749C850Df5A4BbbD2197889dF90103dd06'
        if (!evmAddress) {
            return
        }

        const balances = await getSelectedAccountLayer2BalanceForAddress(evmAddress, chain)
        if (!balances) {
            return Promise.resolve([])
        }

        const layer2Balance: { [tokenId: string]: number } = {}

        for (const { balance, tokenId } of balances) {
            const isNativeToken = Converter.hexToBytes(tokenId).length === TOKEN_ID_BYTE_LENGTH
            if (isNativeToken) {
                const asset = await getOrRequestAssetFromPersistedAssets(tokenId)
                addPersistedAsset(asset)
            }
            layer2Balance[tokenId] = balance
        }
        setLayer2AccountBalanceForChain(index, chainId, layer2Balance)
    })
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
            const nativeTokenResult = (await contract.methods
                .callView(accountsCoreContract, getBalanceFunc, parameters)
                .call()) as { items: { key: string; value: number }[] }

            const nativeTokens = nativeTokenResult.items.map((item) => ({
                tokenId: item.key,
                balance: Number(item.value),
            }))

            return nativeTokens
        } catch (e) {
            return []
        }
    } catch (err) {
        const error = err?.message ?? err
        console.error(error)
    }
}
