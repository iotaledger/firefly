import { getSelectedWallet } from '../stores'

export async function backup(dest: string, password: string): Promise<void> {
    const wallet = getSelectedWallet()
    await wallet.backup(dest, password)
}
