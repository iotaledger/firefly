import { getSelectedWallet } from '../stores'

export async function unsubscribeFromWalletApiEvents(): Promise<void> {
    const wallet = getSelectedWallet()
    await wallet?.clearListeners([])
}
