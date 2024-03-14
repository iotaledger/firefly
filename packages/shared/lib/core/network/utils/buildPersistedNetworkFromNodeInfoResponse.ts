import { COIN_TYPE, DEFAULT_NETWORK_METADATA } from '../constants'
import { INodeInfoResponse, IPersistedNetwork } from '../interfaces'
import { getNetworkIdFromNetworkName } from './getNetworkIdFromNetworkName'

export function buildPersistedNetworkFromNodeInfoResponse(
    nodeInfoResponse: INodeInfoResponse,
    coinType?: number
): IPersistedNetwork {
    const networkName = nodeInfoResponse?.nodeInfo?.protocol.networkName
    const networkId = getNetworkIdFromNetworkName(networkName)
    const bech32Hrp = nodeInfoResponse?.nodeInfo?.protocol.bech32Hrp ?? DEFAULT_NETWORK_METADATA?.[networkId]?.bech32Hrp
    const name = networkName ?? DEFAULT_NETWORK_METADATA?.[networkId]?.name
    const _coinType = coinType ?? COIN_TYPE[networkId] ?? 1
    return {
        id: networkId,
        name: name ?? 'Unknown Network',
        coinType: _coinType,
        bech32Hrp: bech32Hrp ?? 'Unknown Network',
        chains: [],
    }
}
