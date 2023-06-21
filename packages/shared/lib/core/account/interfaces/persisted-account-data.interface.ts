import { ParticipationEventId } from '@iota/wallet/types'

export interface IPersistedAccountData {
    name: string
    color: string
    hidden: boolean
    shouldRevote: boolean
    removedProposalIds?: ParticipationEventId[]
    depositAddress: string
}
