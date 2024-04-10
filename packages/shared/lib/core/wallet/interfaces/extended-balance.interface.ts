import { Balance } from '@iota/sdk/out/types'

export interface IBalance extends Balance {
    blockIssuanceCredits: { [accountId: string]: number }
    totalWalletBic: number
    realAvailableMana: number
}
