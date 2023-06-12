import { Common } from '@ethereumjs/common'
import { EvmTransactionOptions } from '@core/layer-2'
import { ChainId } from '@core/network'

export function getEvmTransactionOptions(chainId: ChainId): EvmTransactionOptions {
    return {
        common: Common.custom({
            chainId,
        }),
    }
}
