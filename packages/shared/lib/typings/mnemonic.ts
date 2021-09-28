export interface MnemonicPayload {
    signerType: {
        type: 'Stronghold'
    }
    mnemonic: string | null
}

export type RecoveryPhrase = string[]
