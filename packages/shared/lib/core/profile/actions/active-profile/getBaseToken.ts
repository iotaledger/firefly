import { activeProfile } from '@core/profile/stores'
import { IBaseToken, TokenStandard } from '@core/wallet'
import { get } from 'svelte/store'

export function getBaseToken(): { standard: TokenStandard.BaseToken } & IBaseToken {
    const $activeProfile = get(activeProfile)
    return {
        standard: TokenStandard.BaseToken,
        ...$activeProfile.network.baseToken,
    }
}
