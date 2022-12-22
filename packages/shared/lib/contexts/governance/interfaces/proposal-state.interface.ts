import type { EventStatus } from '@iota/wallet'

export interface IProposalState {
    [profileId: string]: {
        [eventId: string]: EventStatus
    }
}
