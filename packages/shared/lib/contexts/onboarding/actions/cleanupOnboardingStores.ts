import { mnemonic, networkProtocol, strongholdPassword, walletPin } from '../stores'

export function cleanupOnboardingStores(): void {
    mnemonic.set(null)
    strongholdPassword.set(null)
    walletPin.set(null)
    networkProtocol.set(null)
}
