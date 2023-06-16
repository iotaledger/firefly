import { DestinationNetwork } from '@core/layer-2/enums'

import { ETH_COIN_TYPE } from '../constants'
import { ChainId, ChainType, NetworkId } from '../enums'
import { ChainConfiguration } from '../types'

export const DEFAULT_CHAIN_CONFIGURATIONS: Readonly<{ [id in NetworkId]?: ChainConfiguration }> = {
    [NetworkId.Shimmer]: {
        type: ChainType.Iscp,
        name: DestinationNetwork.ShimmerEvm,
        chainId: ChainId.ShimmerEVM,
        coinType: ETH_COIN_TYPE,
        aliasAddress: '', // 'rms1prwgvvw472spqusqeufvlmp8xdpyxtrnmvt26jnuk6sxdcq2hk8scku26h7',
        iscpEndpoint: '', // 'https://json-rpc.evm.testnet.shimmer.network',
    },
    [NetworkId.Testnet]: {
        type: ChainType.Iscp,
        name: DestinationNetwork.ShimmerEvmTestnet,
        chainId: ChainId.ShimmerEVM,
        coinType: ETH_COIN_TYPE,
        aliasAddress: 'rms1prwgvvw472spqusqeufvlmp8xdpyxtrnmvt26jnuk6sxdcq2hk8scku26h7',
        iscpEndpoint: 'https://json-rpc.evm.testnet.shimmer.network',
    },
}
