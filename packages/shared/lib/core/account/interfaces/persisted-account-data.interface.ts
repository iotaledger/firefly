import { ParticipationEventId } from '@iota/wallet/out/types'

export interface IPersistedAccountData {
    name: string
    color: string
    hidden: boolean
    shouldRevote: boolean
    removedProposalIds?: ParticipationEventId[]
}
