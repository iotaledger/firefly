import { ChainId } from '@core/network'
import { Common } from '@ethereumjs/common'
import { TxOptions } from '@ethereumjs/tx'

export function getTxOptions(chainId: ChainId): TxOptions {
    return {
        common: Common.custom({
            chainId,
        }),
    }
}
