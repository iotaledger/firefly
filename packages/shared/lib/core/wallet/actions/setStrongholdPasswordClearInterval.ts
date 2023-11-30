import { getSelectedWallet } from '../stores'

export async function setStrongholdPasswordClearInterval(intervalInSeconds: number): Promise<void> {
    const wallet = getSelectedWallet();
    await wallet.setStrongholdPasswordClearInterval(intervalInSeconds * 1000)
}
