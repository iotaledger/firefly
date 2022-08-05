import { CoinType } from '@iota/wallet'

import { IOTA_NODE_URL, SHIMMER_NODE_URL } from '../constants'

/**
 * Returns the corresponding node URL given the specific coin type.
 */
export function getNodeUrlFromCoinType(coinType: CoinType): string {
    switch (coinType) {
        case CoinType.IOTA:
            return IOTA_NODE_URL
        case CoinType.Shimmer:
            return SHIMMER_NODE_URL
        default:
            return ''
    }
}
