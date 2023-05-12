import { get } from 'svelte/store'

import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
import { Ledger } from '@core/ledger/classes'
// import { activeProfile } from '@core/profile'
//
// import { ETHEREUM_COIN_TYPE } from '../constants'

export async function loadEvmAddressForSelectedAccount(): Promise<void> {
    try {
        if (!get(selectedAccount)?.evmAddress) {
            const coinType = 60 // get(activeProfile)?.isDeveloperProfile ? 0 : ETHEREUM_COIN_TYPE
            const accountIndex = get(selectedAccountIndex)
            await Ledger.generateEvmAddress(coinType, accountIndex, false)
        }
    } catch (err) {
        console.error(err)
    }
}
