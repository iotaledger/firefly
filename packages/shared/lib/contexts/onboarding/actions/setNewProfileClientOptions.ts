import { get } from 'svelte/store'

import { getDefaultClientOptions, IClientOptions, INode, NetworkType } from '@core/network'
import { updateNewProfile, newProfile } from '../stores'

export function setNewProfileClientOptions(node?: INode): void {
    const profile = get(newProfile)

    let clientOptions: IClientOptions
    if (profile.networkType === NetworkType.PrivateNet) {
        clientOptions = {
            nodes: [node],
        }
    } else {
        clientOptions = getDefaultClientOptions(profile.networkProtocol, profile.networkType)
    }
    updateNewProfile({ clientOptions })
}
