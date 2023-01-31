import type { ParticipationEventStatus } from '@iota/wallet'

export interface IProposalState {
    [profileId: string]: {
        [proposalId: string]: {
            state: ParticipationEventStatus
            nodeUrl: string
        }
    }
}
