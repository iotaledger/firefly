import { getSelectedAccount } from '@core/account/stores'
import { buildBip32Path } from '@core/account/utils'
import { Ledger } from '@core/ledger/classes'

export function loadEvmAddressForSelectedAccount(coinType: number): void {
    try {
        const account = getSelectedAccount()
        if (!account) {
            return
        }
        const { evmAddresses, index } = account
        if (!evmAddresses[coinType]) {
            const bip32Path = buildBip32Path(coinType, index)
            Ledger.generateEvmAddress(bip32Path, false)
        }
    } catch (err) {
        console.error(err)
    }
}
