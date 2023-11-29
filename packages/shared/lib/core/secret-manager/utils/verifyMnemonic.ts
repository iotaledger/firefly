import { api } from "@core/api";

export function verifyMnemonic(mnemonic: string): Promise<void> {
    return api.verifyMnemonic(mnemonic)
}