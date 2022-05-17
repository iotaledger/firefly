import { getOfficialNetworkConfig, INode, updateClientOptions } from '@core/network'
import { updateNewProfileSettings } from '@core/profile'

export function updateNewProfileNetworkConfig(node: INode): void {
    const networkConfig = getOfficialNetworkConfig(node?.network?.protocol, node?.network?.type)
    networkConfig.nodes = [{ ...node, isPrimary: true }]
    updateClientOptions(networkConfig)
    updateNewProfileSettings({ networkConfig })
}
