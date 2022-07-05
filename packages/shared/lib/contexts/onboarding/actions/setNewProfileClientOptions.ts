import { getDefaultClientOptions, IClientOptions, INode, NetworkProtocol, NetworkType } from '@core/network'
import { updateNewProfile } from '../stores'

export function setNewProfileClientOptions(
    networkProtocol: NetworkProtocol,
    networkType: NetworkType,
    node?: INode
): void {
    let clientOptions: IClientOptions
    if (networkType === NetworkType.PrivateNet) {
        clientOptions = {
            nodes: [node],
        }
    } else {
        clientOptions = getDefaultClientOptions(networkProtocol, networkType)
    }
    updateNewProfile({ clientOptions })
}
