import { INetwork } from '../interfaces'

export function checkNetworkId(
    id: string,
    network: INetwork,
    isDeveloperProfile: boolean
): { locale: string; values?: { [key: string]: string | number } } {
    if (!id) {
        return { locale: 'error.network.notReachable' }
    } else if (id !== network?.id && !isDeveloperProfile) {
        return { locale: 'error.network.mismatch', values: { networkId: id } }
    }
}
