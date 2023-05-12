import { get } from 'svelte/store'

import { Platform } from '@core/app/classes'
import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
// import { activeProfile } from '@core/profile'
//
// import { ETHEREUM_COIN_TYPE } from '../constants'

export async function loadEvmAddressForSelectedAccount(): Promise<void> {
    try {
        if (!get(selectedAccount)?.evmAddress) {
            const coinType = 60 // get(activeProfile)?.isDeveloperProfile ? 0 : ETHEREUM_COIN_TYPE
            const accountIndex = get(selectedAccountIndex)
            await Platform.generateEvmAddress(coinType, accountIndex, false)
        }
    } catch (err) {
        console.error(err)
    }
}
