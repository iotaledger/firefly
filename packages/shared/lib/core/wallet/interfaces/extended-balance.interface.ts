import { Balance } from '@iota/sdk/out/types'

export interface IBalance extends Balance {
    blockIssuanceCredits: number
}
