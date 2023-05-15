export function checkNetworkId(
    id: string | undefined,
    clientOptionsNetworkId: string | undefined,
    isDeveloperProfile: boolean
): { locale: string; values?: { [key: string]: string | number } } | undefined {
    if (!id) {
        return { locale: 'error.network.notReachable' }
    } else if (id !== clientOptionsNetworkId && !isDeveloperProfile) {
        return { locale: 'error.network.mismatch', values: { networkId: id } }
    }
}
