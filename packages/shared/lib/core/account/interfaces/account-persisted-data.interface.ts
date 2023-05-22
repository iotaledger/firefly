import type { ParticipationEventId } from '@iota/wallet'

export interface IAccountPersistedData {
    name: string
    color: string
    hidden: boolean
    shouldRevote: boolean
    removedProposalIds?: ParticipationEventId[]
}
