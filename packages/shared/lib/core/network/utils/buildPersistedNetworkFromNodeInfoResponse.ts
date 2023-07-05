import { TokenStandard } from '@core/wallet/enums'
import { COIN_TYPE, DEFAULT_NETWORK_METADATA } from '../constants'
import { NetworkId } from '../enums'
import { INodeInfoResponse, IPersistedNetwork } from '../interfaces'
import { getNetworkIdFromNetworkName } from './getNetworkIdFromNetworkName'

export function buildPersistedNetworkFromNodeInfoResponse(
    nodeInfoResponse: INodeInfoResponse,
    coinType?: number
): IPersistedNetwork {
    const networkName = nodeInfoResponse?.nodeInfo?.protocol.networkName
    const networkId = getNetworkIdFromNetworkName(networkName)
    const name = networkId === NetworkId.Custom ? networkName : DEFAULT_NETWORK_METADATA[networkId]?.name
    const _coinType = coinType ?? COIN_TYPE[networkId] ?? 1
    return {
        id: networkId,
        name: name ?? 'Unknown Network',
        coinType: _coinType,
        protocol: nodeInfoResponse?.nodeInfo?.protocol,
        baseToken: { standard: TokenStandard.BaseToken, ...nodeInfoResponse?.nodeInfo?.baseToken },
        chains: [],
    }
}
