import { Address } from '@lib/typings/address'
import { Message } from '@lib/typings/message'
import { SignerType } from '../enums'
import { IAccountBalances } from './account-balances.interface'
import { IAccount } from './account.interface'

export interface IAccountState extends IAccount {
    id: string
    name: string
    depositAddress: string
    balances: IAccountBalances
    color?: string
    // TODO: refactor or remove these below
    signerType: SignerType
    messages: Message[]
    addresses: Address[]
}
