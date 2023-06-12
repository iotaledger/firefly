import { get } from 'svelte/store'
import { Platform } from '@core/app/classes'
import { addError } from '@core/error'
import { activeAccounts, updateActiveAccount, updateActiveAccountPersistedData } from '@core/profile'
import { deconstructBip32Path } from '@core/account'
import { ChainId, getNetwork } from '@core/network'
import { closePopup } from '../../../../../desktop/lib/auxiliary/popup'

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
        updateActiveAccountPersistedData(accountIndex, { evmAddresses })
    })

    Platform.onEvent('evm-signed-transaction', ({ signedTransaction }) => {
        const provider = getNetwork()?.getChain(ChainId.ShimmerEVM)?.getProvider()
        if (provider) {
            void provider?.eth.sendSignedTransaction(signedTransaction)
            closePopup()
        }
    })
}
