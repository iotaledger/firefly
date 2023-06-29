import { isIscpChain } from '@core/network'
import { getActiveProfile } from '@core/profile/stores'

export function getDestinationNetworkFromAddress(networkAddress: string | undefined): string {
    const { network } = getActiveProfile() ?? {}
    if (!networkAddress) {
        return network?.name
    }

    const chains = network?.chains.filter(isIscpChain)
    const foundDestinationNetwork = chains.find((chain) => chain?.aliasAddress === networkAddress)
    return foundDestinationNetwork?.name ?? networkAddress
}
