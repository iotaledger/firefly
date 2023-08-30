import { api } from '../api'

export function generateMnemonic(): Promise<string> {
    return api.generateMnemonic()
}
