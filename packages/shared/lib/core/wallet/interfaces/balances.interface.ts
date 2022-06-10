import { AccountBalance } from '@iota/wallet'

export interface Balances {
    accountId: string
    activities: AccountBalance[]
}
