import { get } from 'svelte/store'

import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
import { Ledger } from '@core/ledger/classes'
import { activeProfile } from '@core/profile'
import { COIN_TYPE } from '@core/network/constants'

export async function loadEvmAddressForSelectedAccount(): Promise<void> {
    try {
        if (!get(selectedAccount)?.evmAddress) {
            const coinType = COIN_TYPE[get(activeProfile)?.network?.id] ?? 1
            const accountIndex = get(selectedAccountIndex)
            await Ledger.generateEvmAddress(coinType, accountIndex, false)
        }
    } catch (err) {
        console.error(err)
    }
}
