import { getSelectedAccount } from '@core/account/stores'
import { buildBip32Path } from '@core/account/utils'
import { Ledger } from '@core/ledger/classes'
import { network } from '@core/network'
import { get } from 'svelte/store'

export function loadEvmAddressForSelectedAccount(): void {
    try {
        const account = getSelectedAccount()
        if (!account) {
            return
        }
        const { evmAddresses, index } = account
        const chains = get(network)?.getChains() ?? []
        const coinTypes = new Set(chains.map((chain) => chain.getConfiguration().coinType))

        for (const coinType of coinTypes) {
            if (!evmAddresses[coinType]) {
                const bip32Path = buildBip32Path(coinType, index)
                Ledger.generateEvmAddress(bip32Path, false)
            }
        }
    } catch (err) {
        console.error(err)
    }
}
