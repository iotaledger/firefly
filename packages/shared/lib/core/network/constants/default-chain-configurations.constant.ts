import { DestinationNetwork } from '@core/layer-2/enums'

import { ChainId, ChainType, NetworkId } from '../enums'
import { ChainMetadata } from '../types'

export const DEFAULT_CHAIN_CONFIGURATIONS: Readonly<{ [id in NetworkId]?: ChainMetadata }> = {
    [NetworkId.Testnet]: {
        type: ChainType.Iscp,
        name: DestinationNetwork.ShimmerEvmTestnet,
        chainId: ChainId.ShimmerEVM,
        aliasAddress: 'rms1pr75wa5xuepg2hew44vnr28wz5h6n6x99zptk2g68sp2wuu2karywgrztx3',
        iscpEndpoint: 'https://json-rpc.evm.testnet.shimmer.network',
    },
}
