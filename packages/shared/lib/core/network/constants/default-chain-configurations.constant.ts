import { ChainType, NetworkId } from '../enums'
import { ChainConfiguration } from '../types'

export const DEFAULT_CHAIN_CONFIGURATIONS: Readonly<{ [id in NetworkId]?: ChainConfiguration }> = {
    [NetworkId.Shimmer]: {
        type: ChainType.Iscp,
        name: 'ShimmerEVM',
        chainId: 1071,
        aliasAddress: '', // 'rms1prwgvvw472spqusqeufvlmp8xdpyxtrnmvt26jnuk6sxdcq2hk8scku26h7',
        iscpEndpoint: '', // 'https://json-rpc.evm.testnet.shimmer.network',
    },
    [NetworkId.Testnet]: {
        type: ChainType.Iscp,
        name: 'ShimmerEVM',
        chainId: 1071,
        aliasAddress: 'rms1prwgvvw472spqusqeufvlmp8xdpyxtrnmvt26jnuk6sxdcq2hk8scku26h7',
        iscpEndpoint: 'https://json-rpc.evm.testnet.shimmer.network',
    },
}
