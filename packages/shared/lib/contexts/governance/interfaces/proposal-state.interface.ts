import type { EventStatus } from '@iota/wallet'

export interface IProposalState {
    [profileId: string]: {
        [proposalId: string]: {
            state: EventStatus
            nodeUrl: string
        }
    }
}
