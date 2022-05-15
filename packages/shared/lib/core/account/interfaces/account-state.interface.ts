import { Address } from '@lib/typings/address'
import { Message } from '@lib/typings/message'
import { SignerType } from '../enums'
import { IAccountBalances } from './account-balances.interface'
import { IAccountMetadata } from './account-metadata.interface'
import { IAccount } from './account.interface'

export interface IAccountState extends IAccount, IAccountMetadata {
    depositAddress: string
    balances: IAccountBalances
    // TODO: refactor or remove these below
    signerType: SignerType
    messages: Message[]
    addresses: Address[]
}
