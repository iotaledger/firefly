import { getActiveProfile } from '@core/profile/stores'
import { ChainType, IIscpChainConfiguration } from '@core/network'

export function getLayer2NetworkFromAddress(address: string): string | undefined {
    const chainConfigurations = getActiveProfile()?.network?.chainConfigurations
    const iscpNetworks = chainConfigurations?.filter(
        (chain) => chain.type === ChainType.Iscp
    ) as IIscpChainConfiguration[]
    const network = iscpNetworks?.find((chain) => chain.aliasAddress === address)
    return network?.name
}
