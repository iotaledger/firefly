import { activeAccounts, updateActiveAccount } from '@core/profile'
import { get } from 'svelte/store'
import { Platform } from '@core/app/classes'
import { ledgerEvmSignature } from '@core/ledger'

export function registerLayer2EventHandlers(): void {
    Platform.onEvent('evm-address', ({ evmAddress, coinType, accountIndex }) => {
        if (coinType === undefined || !evmAddress || accountIndex === undefined) {
            return
        }
        const evmAddresses = get(activeAccounts)?.[accountIndex]?.evmAddresses
        evmAddresses[coinType] = evmAddress

        updateActiveAccount(accountIndex, { evmAddresses })
    })

    Platform.onEvent('evm-signature', (signature) => {
        ledgerEvmSignature.set(signature)
    })
}
