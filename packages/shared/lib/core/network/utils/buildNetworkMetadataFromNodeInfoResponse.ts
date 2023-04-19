import { NETWORK_METADATA_MAP } from '../constants'
import { NetworkId } from '../enums'
import { IStardustNetworkMetadata, INodeInfoResponse } from '../interfaces'
import { getNetworkIdFromNetworkName } from './getNetworkIdFromNetworkName'

export function buildNetworkMetadataFromNodeInfoResponse(
    nodeInfoResponse: INodeInfoResponse
): IStardustNetworkMetadata {
    const networkName = nodeInfoResponse?.nodeInfo?.protocol?.networkName
    const networkId = getNetworkIdFromNetworkName(networkName)
    return {
        id: networkId,
        name: networkId === NetworkId.Custom ? networkName : NETWORK_METADATA_MAP?.[networkId]?.name,
        protocol: nodeInfoResponse?.nodeInfo?.protocol,
        baseToken: nodeInfoResponse?.nodeInfo?.baseToken,
        chains: [],
    }
}
