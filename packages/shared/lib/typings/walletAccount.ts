import { SignerType, StardustAccount } from './account'
import { Address } from './address'
import { Message } from './message'

// TODO: Refactor balance, messages, addresses and signer type
export interface WalletAccount extends StardustAccount {
    id: string
    depositAddress: string
    rawIotaBalance?: number
    balanceEquiv?: string
    messages: Message[]
    signerType: SignerType
    addresses: Address[]
    color?: string
}

export interface LabeledWalletAccount extends WalletAccount {
    label: string
}
