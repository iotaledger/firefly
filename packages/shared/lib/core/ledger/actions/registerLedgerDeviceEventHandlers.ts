import { Platform } from '@core/app/classes'
import { addError } from '@core/error'
import { get } from 'svelte/store'
import { activeAccounts, updateActiveAccount } from '@core/profile'
import { ledgerEvmSignature } from '@core/ledger'

export function registerLedgerDeviceEventHandlers(): void {
    Platform.onEvent('ledger-error', (error) => {
        addError(error)
    })

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
