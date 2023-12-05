import { get } from 'svelte/store'
import { selectedWallet } from '../stores/selected-wallet.store'

export async function setStrongholdPassword(password: string): Promise<void> {
    console.log(password)
    const wallet = get(selectedWallet)
    // Otherwise error is thrown, if password is still present in memory
    await wallet?.clearStrongholdPassword()
    await wallet?.setStrongholdPassword(password)
}
