import { get } from 'svelte/store'
import { getOfficialNodes, NetworkType, updateNewProfileNetworkClientOptions } from '@core/network'
import { newProfile, updateNewProfile } from '@core/profile'

export function updateNewProfileNetworkType(networkType: NetworkType): void {
    if (networkType !== NetworkType.PrivateNet) {
        const nodes = getOfficialNodes(get(newProfile)?.networkProtocol, networkType)
        updateNewProfileNetworkClientOptions(get(newProfile)?.networkProtocol, networkType, nodes)
    }
    updateNewProfile({ networkType })
}
