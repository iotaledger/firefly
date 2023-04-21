import { TokenStandard } from '@core/wallet/enums'
import { COIN_TYPE, NETWORK_METADATA } from '../constants'
import { NetworkId } from '../enums'
import { IStardustNetworkMetadata, INodeInfoResponse } from '../interfaces'
import { getNetworkIdFromNetworkName } from './getNetworkIdFromNetworkName'

export function buildNetworkMetadataFromNodeInfoResponse(
    nodeInfoResponse: INodeInfoResponse,
    coinType?: number
): IStardustNetworkMetadata {
    const networkName = nodeInfoResponse?.nodeInfo?.protocol?.networkName
    const networkId = getNetworkIdFromNetworkName(networkName)
    const _coinType = coinType ?? COIN_TYPE[networkId] ?? 1
    return {
        id: networkId,
        name: networkId === NetworkId.Custom ? networkName : NETWORK_METADATA?.[networkId]?.name,
        coinType: _coinType,
        protocol: nodeInfoResponse?.nodeInfo?.protocol,
        baseToken: { standard: TokenStandard.BaseToken, ...nodeInfoResponse?.nodeInfo?.baseToken },
        chains: [],
    }
}
