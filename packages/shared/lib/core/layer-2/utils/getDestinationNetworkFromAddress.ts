import { getActiveProfile } from '@core/profile/stores'
import { DestinationNetwork } from '../enums'

export function getDestinationNetworkFromAddress(networkAddress: string): string {
    if (!networkAddress) {
        return DestinationNetwork.Shimmer
    }

    const chainConfigurations = getActiveProfile()?.network?.chainConfigurations
    const foundDestinationNetwork = chainConfigurations.find((chain) => chain?.aliasAddress === networkAddress)
    return foundDestinationNetwork?.name ?? networkAddress
}
