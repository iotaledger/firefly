import { DestinationNetwork } from '@core/layer-2/enums'

import { ChainId, ChainType, NetworkId } from '../enums'
import { ChainMetadata } from '../types'

export const DEFAULT_CHAIN_CONFIGURATIONS: Readonly<{ [id in NetworkId]?: ChainMetadata }> = {
    [NetworkId.Shimmer]: {
        type: ChainType.Iscp,
        name: DestinationNetwork.ShimmerEvm,
        chainId: ChainId.ShimmerEVM,
        aliasAddress: 'rms1pr75wa5xuepg2hew44vnr28wz5h6n6x99zptk2g68sp2wuu2karywgrztx3', // TODO: pending modification
        iscpEndpoint: 'https://json-rpc.evm.testnet.shimmer.network', // TODO: pending modification
    },
    [NetworkId.Testnet]: {
        type: ChainType.Iscp,
        name: DestinationNetwork.ShimmerEvmTestnet,
        chainId: ChainId.ShimmerEVM,
        aliasAddress: 'rms1ppnkvsjctdg53v2x89uzhuxg89s073jmn2nuzcw44tggjy8rzzgzq2rg0qp',
        iscpEndpoint: 'https://7-teamnet.chrysalis2.com/wasp/api/v1/chains/rms1ppnkvsjctdg53v2x89uzhuxg89s073jmn2nuzcw44tggjy8rzzgzq2rg0qp',
    },
}
