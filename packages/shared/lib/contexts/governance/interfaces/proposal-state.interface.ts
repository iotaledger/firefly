import type { ParticipationEventStatus, Question } from '@iota/sdk/out/types'
import { IOrganization, ProposalError } from '..'
import { ProposalStatus, ProposalType } from '../enums'

export interface IProposal extends IProposalMetadata {
    status: string
}

export interface IProposalState {
    [proposalId: string]: {
        state: ParticipationEventStatus
    }
}

export interface IRegisteredProposals {
    [proposalId: string]: IProposalMetadata
}

export interface IProposalMetadata {
    id: string
    slots?: Record<ProposalStatus, number>
    organization?: IOrganization
    type: ProposalType
    questions: Question[]
    additionalInfo: string
    title: string
    nodeUrl: string
    error?: ProposalError
}
