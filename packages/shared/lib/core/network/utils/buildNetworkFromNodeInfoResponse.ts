import { NETWORK, TESTNET_COIN_TYPE } from '../constants'
import { NetworkId } from '../enums'
import { INetwork, INodeInfoResponse } from '../interfaces'
import { getNetworkIdFromNetworkName } from './getNetworkIdFromNetworkName'

export function buildNetworkFromNodeInfoResponse(nodeInfoResponse: INodeInfoResponse, chainId?: number): INetwork {
    const networkName = nodeInfoResponse?.nodeInfo?.protocol?.networkName
    const networkId = getNetworkIdFromNetworkName(networkName)
    return {
        id: networkId,
        name: networkId === NetworkId.Custom ? networkName : NETWORK?.[networkId]?.name,
        coinType: chainId || (NETWORK?.[networkId]?.coinType ?? TESTNET_COIN_TYPE),
        protocol: nodeInfoResponse?.nodeInfo?.protocol,
        baseToken: nodeInfoResponse?.nodeInfo?.baseToken,
    }
}
