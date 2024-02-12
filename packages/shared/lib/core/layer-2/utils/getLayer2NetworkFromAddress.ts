import { getActiveProfile } from '@core/profile/stores'
import { ChainType, IIscpChainMetadata } from '@core/network'

export function getLayer2NetworkFromAddress(address: string): string | undefined {
    const chains = getActiveProfile()?.network?.chains
    const iscpNetworks = chains?.filter((chain) => chain.type === ChainType.Iscp) as IIscpChainMetadata[]
    const network = iscpNetworks?.find((chain) => chain.anchorAddress === address)
    return network?.name
}
