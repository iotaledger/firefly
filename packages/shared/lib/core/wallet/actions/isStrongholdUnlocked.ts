import { getSelectedWallet } from '../stores'

export function isStrongholdUnlocked(): Promise<boolean> {
    const wallet = getSelectedWallet();
    return wallet.isStrongholdPasswordAvailable()
}
