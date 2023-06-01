import { network } from '@core/network/stores'
import { IErc20Metadata, TokenStandard } from '@core/wallet'
import { get } from 'svelte/store'
import { ContractType } from '../enums'

export async function getErc20TokenMetadata(
    tokenAddress: string,
    chainId: number
): Promise<IErc20Metadata | undefined> {
    const chain = get(network)?.getChain(chainId)
    const contract = chain?.getContract(ContractType.Erc20, tokenAddress)
    if (contract) {
        const [name, symbol, decimals] = await Promise.all([
            contract.methods.name().call(),
            contract.methods.symbol().call(),
            contract.methods.decimals().call(),
        ])
        return { standard: TokenStandard.Erc20, name, symbol, decimals }
    }
}
