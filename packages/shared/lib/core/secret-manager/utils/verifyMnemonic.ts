import { api } from '@core/api'

export function verifyMnemonic(mnemonic: string): void {
    return api.verifyMnemonic(mnemonic)
}
