import { getSecretManager } from '@core/secret-manager/actions'
import { getSelectedWallet } from '../stores/selected-wallet.store'

export async function setStrongholdPassword(password: string): Promise<void> {
    // Set in Wallet
    const wallet = getSelectedWallet()
    // Otherwise error is thrown, if password is still present in memory
    await wallet?.clearStrongholdPassword()
    await wallet?.setStrongholdPassword(password)

    // Set in SecretManager
    const secretManager = getSecretManager()
    await secretManager?.clearStrongholdPassword()
    await secretManager.setStrongholdPassword(password)
}
