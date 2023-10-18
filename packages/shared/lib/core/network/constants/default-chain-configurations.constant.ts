import { DestinationNetwork } from '@core/layer-2/enums'

import { ChainId, ChainType, NetworkId } from '../enums'
import { ChainMetadata } from '../types'

export const DEFAULT_CHAIN_CONFIGURATIONS: Readonly<{ [id in NetworkId]?: ChainMetadata }> = {
    [NetworkId.Shimmer]: {
        type: ChainType.Iscp,
        name: DestinationNetwork.ShimmerEvm,
        chainId: ChainId.ShimmerEVM,
        aliasAddress: 'smr1prxvwqvwf7nru5q5xvh5thwg54zsm2y4wfnk6yk56hj3exxkg92mx20wl3s',
        iscpEndpoint:
            'https://api.evm.shimmer.network/v1/chains/smr1prxvwqvwf7nru5q5xvh5thwg54zsm2y4wfnk6yk56hj3exxkg92mx20wl3s',
    },
    [NetworkId.Testnet]: {
        type: ChainType.Iscp,
        name: DestinationNetwork.ShimmerEvmTestnet,
        chainId: ChainId.ShimmerEVMTestnet,
        aliasAddress: 'rms1ppp00k5mmd2m8my8ukkp58nd3rskw6rx8l09aj35984k74uuc5u2cywn3ex',
        iscpEndpoint:
            'https://api.evm.testnet.shimmer.network/v1/chains/rms1ppp00k5mmd2m8my8ukkp58nd3rskw6rx8l09aj35984k74uuc5u2cywn3ex',
    },
}
