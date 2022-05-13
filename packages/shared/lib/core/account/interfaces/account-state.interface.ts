import { SignerType } from '@lib/typings/account'
import { Address } from '@lib/typings/address'
import { Message } from '@lib/typings/message'
import { IAccount } from './account.interface'

export interface IAccountState extends IAccount {
    id: string
    depositAddress: string
    color?: string
    // TODO remove or refactor below
    rawIotaBalance?: number
    balanceEquiv?: string
    signerType: SignerType
    messages: Message[]
    addresses: Address[]
}
