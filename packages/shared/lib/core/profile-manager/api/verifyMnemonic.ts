import { api } from '../api'

export async function verifyMnemonic(mnemonic: string): Promise<void> {
    return api.verifyMnemonic(mnemonic)
}
