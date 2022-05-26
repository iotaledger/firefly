import { INode, NetworkProtocol, NetworkType, updateNewProfileNetworkClientOptions } from '@core/network'
import { updateNewProfile } from '@core/profile'

export function updateNewProfileNetwork(networkProtocol: NetworkProtocol, networkType: NetworkType, node: INode): void {
    updateNewProfile({ networkProtocol: networkProtocol, networkType })
    updateNewProfileNetworkClientOptions(networkProtocol, networkType, [node])
}
