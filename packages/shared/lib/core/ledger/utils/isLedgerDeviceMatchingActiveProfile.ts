import { getSecretManager } from '@core/secret-manager'
import { getSelectedWallet } from '@core/wallet'
import { LedgerAppName } from '../enums'
import { isLedgerAppOpen } from './isLedgerAppOpen'

export async function isLedgerDeviceMatchingActiveProfile(): Promise<boolean | undefined> {
    if (isLedgerAppOpen(LedgerAppName.Shimmer)) {
        try {
            const wallet = getSelectedWallet()
            if (!wallet) {
                return undefined
            }

            const cachedAddress = wallet?.depositAddress
            const secretManager = getSecretManager();
            const generatedAddresses = await secretManager.generateEd25519Addresses({
                accountIndex: 0,
                options: {
                    internal: false,
                    ledgerNanoPrompt: false,
                }
            })
            const generatedAddress = generatedAddresses[0]

            return cachedAddress === generatedAddress
        } catch (err) {
            return undefined
        }
    } else {
        return undefined
    }
}
