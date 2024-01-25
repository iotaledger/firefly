import { getActiveProfile } from '@core/profile/stores'

export function getDestinationNetworkFromAddress(networkAddress: string | undefined): string {
    const { network } = getActiveProfile() ?? {}
    if (!networkAddress) {
        return network?.name
    }

    const foundDestinationNetwork = network?.chains?.find((chain) => chain?.accountAddress === networkAddress)
    return foundDestinationNetwork?.name ?? networkAddress
}
