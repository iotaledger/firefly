import { AccountBalance } from '@iota/wallet'
import { Message } from '@lib/typings/message'
import { SignerType } from '../enums'
import { IAccountMetadata } from './account-metadata.interface'
import { IAccount } from './account.interface'

export interface IAccountState extends IAccount, IAccountMetadata {
    depositAddress: string
    balances: AccountBalance
    // TODO: refactor or remove these below
    signerType: SignerType
    messages: Message[]
    isSyncing: boolean
}
