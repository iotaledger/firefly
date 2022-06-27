import { getDefaultClientOptions, IClientOptions, INode, NetworkProtocol, NetworkType } from '@core/network'
import { updateNewProfile } from '@core/profile'

export async function setNewProfileClientOptions(
    networkProtocol: NetworkProtocol,
    networkType: NetworkType,
    node?: INode
): Promise<void> {
    let clientOptions: IClientOptions
    if (networkType === NetworkType.PrivateNet) {
        clientOptions = {
            nodes: [node],
        }
    } else {
        clientOptions = await getDefaultClientOptions(networkProtocol, networkType)
    }
    updateNewProfile({ clientOptions })
}
