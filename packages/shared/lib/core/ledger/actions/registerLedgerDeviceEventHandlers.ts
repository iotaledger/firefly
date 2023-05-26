import { Platform } from '@core/app/classes'
import { addError } from '@core/error'
import { get } from 'svelte/store'
import { activeAccounts, updateActiveAccount } from '@core/profile'
import { ledgerEvmSignature } from '@core/ledger'
import { deconstructBip32Path } from '@core/account'

export function registerLedgerDeviceEventHandlers(): void {
    Platform.onEvent('ledger-error', (error) => {
        addError(error)
    })

    Platform.onEvent('evm-address', ({ evmAddress, bip32Path }) => {
        const { coinType, accountIndex } = deconstructBip32Path(bip32Path)
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
