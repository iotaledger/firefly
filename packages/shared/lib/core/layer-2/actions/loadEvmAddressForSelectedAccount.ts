import { getSelectedAccount } from '@core/account/stores'
import { Ledger } from '@core/ledger/classes'
import { network } from '@core/network'
import { get } from 'svelte/store'

export async function loadEvmAddressForSelectedAccount(): Promise<void> {
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
                await Ledger.generateEvmAddress(coinType, index, false)
            }
        }
    } catch (err) {
        console.error(err)
    }
}
