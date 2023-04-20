import { COIN_TYPE, NETWORK } from '../constants'
import { NetworkId } from '../enums'
import { INetwork, INodeInfoResponse } from '../interfaces'
import { getNetworkIdFromNetworkName } from './getNetworkIdFromNetworkName'

export function buildNetworkFromNodeInfoResponse(nodeInfoResponse: INodeInfoResponse, coinType: number): INetwork {
    const networkName = nodeInfoResponse?.nodeInfo?.protocol?.networkName
    const networkId = getNetworkIdFromNetworkName(networkName)
    const _coinType = coinType ?? COIN_TYPE[networkId] ?? 1
    return {
        id: networkId,
        name: networkId === NetworkId.Custom ? networkName : NETWORK?.[networkId]?.name,
        coinType: _coinType,
        protocol: nodeInfoResponse?.nodeInfo?.protocol,
        baseToken: nodeInfoResponse?.nodeInfo?.baseToken,
        chains: [],
    }
}
