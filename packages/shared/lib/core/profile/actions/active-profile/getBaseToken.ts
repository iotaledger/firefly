import { IBaseToken, TokenStandard } from '@core/wallet'
import { nodeInfo } from '@core/network'
import { get } from 'svelte/store'

export function getBaseToken(): IBaseToken {
    const $nodeInfo = get(nodeInfo)

    return {
        standard: TokenStandard.BaseToken,
        ...$nodeInfo?.baseToken,
    }
}
