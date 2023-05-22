import { getSelectedAccount } from '@core/account/stores'
import { Ledger } from '@core/ledger/classes'

export async function loadEvmAddressForSelectedAccount(coinType: number): Promise<void> {
    try {
        const account = getSelectedAccount()
        if (!account || coinType === undefined) {
            return
        }
        const { evmAddresses, index } = account
        if (coinType !== undefined && !evmAddresses[coinType]) {
            await Ledger.generateEvmAddress(coinType, index, false)
        }
    } catch (err) {
        console.error(err)
    }
}
