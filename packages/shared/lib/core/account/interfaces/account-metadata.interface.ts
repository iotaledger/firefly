import type { ParticipationEventId } from '@iota/wallet'

export interface IAccountMetadata {
    index: number
    name: string
    color: string
    hidden: boolean
    shouldRevote: boolean
    removedProposalIds?: ParticipationEventId[]
}
