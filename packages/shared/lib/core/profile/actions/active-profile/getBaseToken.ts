import { IBaseToken, TokenStandard } from '@core/wallet'
import { nodeInfoBaseToken } from '@core/network'
import { get } from 'svelte/store'

export function getBaseToken(): IBaseToken {
    const $nodeInfoBaseToken = get(nodeInfoBaseToken)

    return {
        standard: TokenStandard.BaseToken,
        ...$nodeInfoBaseToken,
    }
}
