export function checkNetworkId(
    id: string,
    clientOptionsNetworkId: string,
    isDeveloperProfile: boolean
): { locale: string; values?: { [key: string]: string | number } } {
    if (!id) {
        return { locale: 'error.network.notReachable' }
    } else if (id !== clientOptionsNetworkId && !isDeveloperProfile) {
        return { locale: 'error.network.mismatch', values: { networkId: id } }
    }
}
