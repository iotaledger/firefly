import type { ParticipationEventStatus } from '@iota/wallet'
import { IOrganization } from '..'
import { ProposalStatus, ProposalType } from '../enums'

// combined from persistent and non-persistend store
export interface IProposal extends IProposalMetadata {
    state: ParticipationEventStatus
}

// not-persistent, global changing (not account related)
export interface IProposalState {
    [proposalId: string]: {
        state: ParticipationEventStatus
    }
}

// persistent
export interface IPersistedProposals {
    [profileId: string]: {
        [accountId: number]: IRegisteredProposals
    }
}

export interface IRegisteredProposals {
    [proposalId: string]: IProposalMetadata
}

export interface IProposalMetadata {
    id: string
    milestones?: Record<ProposalStatus, number>
    organization?: IOrganization
    type: ProposalType
    title: string
    participated: boolean
    nodeUrl: string
}
