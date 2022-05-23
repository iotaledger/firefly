import { getOfficialNetworkConfig, INode, updateClientOptions } from '@core/network'
import { updateNewProfileSettings } from '@core/profile'
import { NetworkProtocol, NetworkType } from '../enums'
import { buildClientOptions } from '../helpers'
import { getNetwork } from '../utils'

export function updateNewProfileNetworkClientOptions(
    networkProtocol: NetworkProtocol,
    networkType: NetworkType,
    node: INode
): void {
    const clientOptions = buildClientOptions(getNetwork(networkProtocol, networkType), [node])
    updateNewProfileSettings({ clientOptions })
}
