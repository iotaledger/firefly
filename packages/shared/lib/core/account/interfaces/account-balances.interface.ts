import { RequiredStorageDeposit } from '@iota/sdk/out/types'

export interface IAccountBalances {
    aliases: unknown[]
    available: number
    foundries: unknown[]
    nativeToken: Record<string, unknown>
    nfts: unknown[]
    potentiallLockedOutputs: unknown[]
    requiredStorageDeposit: RequiredStorageDeposit
    total: number
}
