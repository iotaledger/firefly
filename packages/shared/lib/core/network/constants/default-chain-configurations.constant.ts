import { DestinationNetwork } from '@core/layer-2'
import { ChainType, NetworkId } from '../enums'
import { ChainConfiguration } from '../types'

export const DEFAULT_CHAIN_CONFIGURATIONS: Readonly<{ [id in NetworkId]?: ChainConfiguration }> = {
    [NetworkId.Shimmer]: {
        type: ChainType.Iscp,
        name: DestinationNetwork.Shimmer,
        chainId: 1071,
        aliasAddress: '', // 'rms1prwgvvw472spqusqeufvlmp8xdpyxtrnmvt26jnuk6sxdcq2hk8scku26h7',
        iscpEndpoint: '', // 'https://json-rpc.evm.testnet.shimmer.network',
    },
    [NetworkId.Testnet]: {
        type: ChainType.Iscp,
        name: DestinationNetwork.ShimmerEvmTestnet,
        chainId: 1071,
        aliasAddress: 'rms1prwgvvw472spqusqeufvlmp8xdpyxtrnmvt26jnuk6sxdcq2hk8scku26h7',
        iscpEndpoint: 'https://json-rpc.evm.testnet.shimmer.network',
    },
}
