import { getSelectedAccount } from '@core/account/stores'
import { Ledger } from '@core/ledger/classes'
import { getActiveProfile } from '@core/profile'
import { COIN_TYPE } from '@core/network/constants'

export async function loadEvmAddressForSelectedAccount(): Promise<void> {
    try {
        const { evmAddress, index } = getSelectedAccount() ?? {}
        if (!evmAddress) {
            const coinType = COIN_TYPE[getActiveProfile()?.network?.id] ?? 1
            await Ledger.generateEvmAddress(coinType, index ?? 0, false)
        }
    } catch (err) {
        console.error(err)
    }
}
