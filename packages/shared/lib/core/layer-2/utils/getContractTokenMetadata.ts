import { IContractTokenMetadata } from '../interfaces'
import { Contract } from '../types'

export async function getContractTokenMetadata(contract: Contract): Promise<IContractTokenMetadata> {
    const [name, symbol, decimals] = await Promise.all([
        contract.methods.name().call(),
        contract.methods.symbol().call(),
        contract.methods.decimals().call(),
    ])
    return { name, symbol, decimals }
}
