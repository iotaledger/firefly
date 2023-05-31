import { IErc20Metadata, TokenStandard } from '@core/wallet'
import { Contract } from '../types'

export async function getErc20MetadataFromContract(contract: Contract): Promise<IErc20Metadata> {
    const [name, symbol, decimals] = await Promise.all([
        contract.methods.name().call(),
        contract.methods.symbol().call(),
        contract.methods.decimals().call(),
    ])
    return { standard: TokenStandard.Erc20, name, symbol, decimals }
}
