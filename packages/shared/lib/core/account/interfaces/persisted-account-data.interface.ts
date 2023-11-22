import { ParticipationEventId, WalletOptions } from '@iota/sdk/out/types'

export interface IPersistedAccountData {
    name: string
    color: string
    hidden: boolean
    shouldRevote: boolean
    removedProposalIds?: ParticipationEventId[]
    walletOptions: WalletOptions
}
